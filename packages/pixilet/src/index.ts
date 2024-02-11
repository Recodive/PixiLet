import type { LeafletEventHandlerFn, LeafletMouseEvent, Point, ZoomAnimEvent } from "leaflet";

import { setOptions } from "./functions/setOptions.js";
import { setPosition } from "./functions/setPosition.js";
import { setStyle } from "./functions/setStyle.js";
import { setUtils } from "./functions/setUtils.js";
import { setupToggleRounding } from "./functions/toggleRounding.js";
import type { IPixiLetLayer, PixiLetDrawCallback, PixiLetDrawCallbackEvent, PixiLetEvents, PixiLetOptions, PixiLetUtils } from "./types.js";
export * from "./types.js";

export function register(L: typeof import("leaflet"), PIXI: typeof import("pixi.js")) {
	const toggleRounding = setupToggleRounding(L);

	L.PixiLetLayer = L.Layer.extend({
		_destroy(this: IPixiLetLayer): void {
			this._renderer.destroy(true);
			this._bufferedRenderer?.destroy(true);
		},
		_initContainer(this: IPixiLetLayer): void {
			this._container = L.DomUtil.create("div", "pixilet-layer");
			setStyle(this._container, { position: "absolute" });
			this._renderer = PIXI.autoDetectRenderer(this.options.renderer);
			this._container.append(this._renderer.view as HTMLCanvasElement);
			if (this._zoomAnimated) L.DomUtil.addClass(this._container, "leaflet-zoom-animated");
			if (this._doubleBuffering) {
				this._bufferedRenderer = PIXI.autoDetectRenderer(this.options.renderer);
				this._container.append(this._bufferedRenderer.view as HTMLCanvasElement);
				setStyle(this._renderer, { position: "absolute" });
				setStyle(this._bufferedRenderer, { position: "absolute" });
			}
		},
		_onAnimZoom(this: IPixiLetLayer, { center, zoom }: ZoomAnimEvent): void {
			setPosition.call(this, L, center, zoom);
		},
		_onMove(this: IPixiLetLayer, event: LeafletMouseEvent): void {
			if (this.options.shouldRedrawOnMove(this._map, event)) this._update(event);
		},
		_onZoom(this: IPixiLetLayer): void {
			setPosition.call(this, L, this._map.getCenter(), this._map.getZoom());
		},
		async _redraw(this: IPixiLetLayer, offset: Point, event: PixiLetDrawCallbackEvent): Promise<void> {
			toggleRounding(false);
			const scale = this._map.getZoomScale(this._map.getZoom(), this._initialZoom),
				shift = this._map.latLngToLayerPoint(this._wgs.origin)._subtract(this._wgs.initialShift.multiplyBy(scale))._subtract(offset);
			this.options.container.scale.set(scale);
			this.options.container.position.set(shift.x, shift.y);
			await this._drawCallback(this.utils, event);
			toggleRounding(true);
		},
		_update(this: IPixiLetLayer, event: PixiLetDrawCallbackEvent): void {
			//* They seem to do this in leaflet... so I guess I will too
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (this._map._animatingZoom && this._bounds) return;

			//* Update pixel bounds of renderer container
			const {
					padding,
					renderer: { resolution },
				} = this.options,
				mapSize = this._map.getSize(),
				min = this._map.containerPointToLayerPoint(mapSize.multiplyBy(-padding)).round();

			this._bounds = L.bounds(min, min.add(mapSize.multiplyBy(1 + padding * 2)).round());

			if (this._doubleBuffering && this._bufferedRenderer) {
				const currentRenderer = this._renderer;
				this._renderer = this._bufferedRenderer;
				this._bufferedRenderer = currentRenderer;
			}

			const { gl, rootRenderTarget, width } = this._renderer,
				b = this._bounds,
				container = this._container,
				size = b.getSize();

			// eslint-disable-next-line unicorn/explicit-length-check, @typescript-eslint/no-unsafe-member-access
			if (!this._renderer.size || this._renderer.size.x !== size.x || this._renderer.size.y !== size.y) {
				if (gl) {
					this._renderer.resolution = resolution;
					if (rootRenderTarget) rootRenderTarget.resolution = resolution;
				}
				this._renderer.resize(size.x, size.y);
				setStyle(this._renderer, {
					height: `${size.y}px`,
					width: `${size.x}px`,
				});
				if (gl && gl.drawingBufferWidth !== width) {
					const newResolution = (resolution * gl.drawingBufferWidth) / width;
					this._renderer.resolution = newResolution;
					if (rootRenderTarget) rootRenderTarget.resolution = newResolution;
					this._renderer.resize(size.x, size.y);
				}
				this._renderer.size = size;
			}

			if (!b.min) return;
			if (this._doubleBuffering) {
				// eslint-disable-next-line @typescript-eslint/no-this-alias, unicorn/no-this-assignment
				const self = this;
				requestAnimationFrame(function () {
					if (!b.min) return;
					void self._redraw(b.min, event);
					self._renderer.gl?.finish();
					setStyle(self._renderer, {
						visibility: "visible",
					});
					setStyle(self._bufferedRenderer, {
						visibility: "hidden",
					});
					L.DomUtil.setPosition(container, b.min);
				});
			} else {
				void this._redraw(b.min, event);
				L.DomUtil.setPosition(container, b.min);
			}
		},
		destroy(this: IPixiLetLayer): void {
			this.remove();
			this._destroy();
		},
		getEvents(this: IPixiLetLayer) {
			return {
				move: this._onMove.bind(this),
				moveend: this._update.bind(this),
				zoom: this._onZoom.bind(this),
				zoomanim: this._zoomAnimated ? this._onAnimZoom.bind(this) : undefined,
			} satisfies PixiLetEvents as Record<string, LeafletEventHandlerFn>;
		},
		initialize(this: IPixiLetLayer, drawCallback: PixiLetDrawCallback, options?: Partial<PixiLetOptions>): void {
			setOptions.call(this, L, PIXI, options);
			L.stamp(this);
			this._drawCallback = drawCallback;
			this._doubleBuffering = PIXI.utils.isWebGLSupported() && !this.options.renderer.forceCanvas && this.options.doubleBuffering;
		},
		onAdd(this: IPixiLetLayer, map: L.Map) {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (!this._container) this._initContainer();
			this.getPane()?.append(this._container);

			this._initialZoom = this.options.projectionZoom(map);
			const origin = L.latLng([0, 0]);
			this._wgs = {
				initialShift: map.project(origin, this._initialZoom),
				origin,
			};
			this._mapInitialZoom = map.getZoom();

			setUtils.call(this, L);

			this._update({ type: "add" });

			return this;
		},
		onRemove(this: IPixiLetLayer, _: L.Map) {
			L.DomUtil.remove(this._container);
			return this;
		},
		async redraw(this: IPixiLetLayer, data?: undefined): Promise<IPixiLetLayer> {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (this._map) {
				toggleRounding(false);
				await this._drawCallback(this.utils, data);
				toggleRounding(true);
			}
			return this;
		},
	} satisfies Partial<IPixiLetLayer>);
	L.pixiLetLayer = <DrawData = undefined>(drawCallback: PixiLetDrawCallback<DrawData>, options?: Partial<PixiLetOptions>) => {
		return new L.PixiLetLayer<DrawData>(drawCallback, options);
	};
}

declare module "leaflet" {
	function pixiLetLayer<DrawData = undefined>(draw: PixiLetDrawCallback<DrawData>, options?: Partial<PixiLetOptions>): PixiLetLayer<DrawData>;

	class PixiLetLayer<DrawData = undefined> extends Layer {
		constructor(draw: PixiLetDrawCallback<DrawData>, options?: Partial<PixiLetOptions>);
		options: PixiLetOptions;
		utils: PixiLetUtils;
		redraw(data?: DrawData): Promise<this>;
		destroy(): void;
	}
}

export default register;
