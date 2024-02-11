import type { Bounds, LatLng, Layer, LayerOptions, LeafletEvent, Map, Point } from "leaflet";
import type { Container, IRenderer, IRendererOptionsAuto } from "pixi.js";

import type { project } from "./functions/project.js";
import type { unproject } from "./functions/unproject.js";

export interface PixiLetEvents {
	move(event: LeafletEvent): void;
	moveend(event: LeafletEvent): void;
	zoom(event: LeafletEvent): void;
	zoomanim?(event: LeafletEvent): void;
}

export interface PixiLetUtils {
	project: ReturnType<typeof project>;
	unproject: ReturnType<typeof unproject>;
	getScale: (zoom?: number) => number;
	getRenderer: () => IRenderer;
	getContainer: () => Container;
	getMap: () => Map;
	render: () => void;
}

export interface PixiLetOptions extends LayerOptions {
	/**
	 * The PIXI container that holds the PIXI objects
	 *
	 * @default new PIXI.Container()
	 */
	container: Container;
	/**
	 * Options for the PIXI renderer
	 *
	 * @default {
	 * 	"antialias": true,
	 * 	"backgroundAlpha": 0,
	 * 	"clearBeforeRender": true,
	 * 	"resolution": L.Browser.retina ? 2 : 1,
	 * }
	 * @see https://pixijs.download/dev/docs/PIXI.IRendererOptions.html
	 */
	renderer: Partial<IRendererOptionsAuto> & {
		/**
		 * Whether to use antialiasing
		 *
		 * @default true
		 */
		antialias: boolean;
		/**
		 * The background alpha
		 *
		 * @default 0
		 */
		backgroundAlpha: number;
		/**
		 * Whether to clear the canvas before rendering
		 *
		 * @default true
		 */
		clearBeforeRender: boolean;
		/**
		 * The resolution of the renderer
		 *
		 * @default L.Browser.retina ? 2 : 1
		 */
		resolution: number;
	};
	/**
	 * Whether to use double buffering
	 *
	 * Using double buffering can reduce flickering when zooming in and out.
	 *
	 * @default false
	 */
	doubleBuffering: boolean;
	/**
	 * The padding of the map in the PIXI container
	 *
	 * (0.1 means it will extend the drawing area by 10% on each side)
	 *
	 * @default 0.1
	 */
	padding: number;
	/**
	 * The zoom level of the projection
	 *
	 * @default (map.getMinZoom() + map.getMaxZoom()) / 2
	 */
	projectionZoom: (map: Map) => number;
	/**
	 * Whether to redraw on move
	 *
	 * @default false
	 */
	shouldRedrawOnMove: (map: Map, event: LeafletEvent) => boolean;
}

export interface IPixiLetLayer<DrawData = undefined> extends Layer {
	utils: PixiLetUtils;
	options: PixiLetOptions;
	/**
	 * The PIXI renderer
	 *
	 * @protected
	 */
	_renderer: IRenderer;
	/**
	 * Another PIXI renderer for double buffering
	 *
	 * @protected
	 */
	_bufferedRenderer?: IRenderer;
	/**
	 * The initial zoom level of the projection
	 *
	 * @protected
	 */
	_initialZoom: number;
	/**
	 * The initial zoom level of the map
	 *
	 * @protected
	 */
	_mapInitialZoom: number;
	/**
	 * The DIV element that holds the PIXI container
	 *
	 * @protected
	 */
	_container: HTMLDivElement;
	/**
	 * Whether the double buffering is enabled
	 *
	 * @protected
	 */
	_doubleBuffering: boolean;
	/**
	 * The bounds of the map
	 *
	 * @protected
	 */
	_bounds: Bounds;
	/**
	 * The wgs origin and initial shift
	 *
	 * @protected
	 */
	_wgs: {
		/**
		 * The wgs origin
		 *
		 * @protected
		 */
		origin: LatLng;
		/**
		 * The initial shift
		 *
		 * @protected
		 */
		initialShift: Point;
	};
	/**
	 * The draw callback
	 *
	 * @protected
	 */
	_drawCallback: PixiLetDrawCallback<DrawData>;
	/**
	 * Call the draw callback
	 */
	redraw(data?: DrawData): Promise<IPixiLetLayer<DrawData>>;
	/**
	 * Internal method to call the draw callback
	 *
	 * @protected
	 */
	_redraw(offset: Point, event: PixiLetDrawCallbackEvent<DrawData>): Promise<void>;
	/**
	 * Initalize the PIXI container
	 *
	 * @protected
	 */
	_initContainer(): void;
	/**
	 * Destroy the PIXI container
	 *
	 * @protected
	 */
	_destroy(): void;
	/**
	 * Destroy the PIXI container
	 */
	destroy(): void;
	/**
	 * Initialize the layer
	 */
	initialize(drawCallback: PixiLetDrawCallback<DrawData>, options?: Partial<PixiLetOptions>): void;
	_onAnimZoom(event: LeafletEvent): void;
	_onZoom(event: LeafletEvent): void;
	_onMove(event: LeafletEvent): void;
	_update(event: PixiLetDrawCallbackEvent<DrawData>): void;
}

export type PixiLetDrawCallbackEvent<T = undefined> =
	| {
		type: "add";
	}
	| LeafletEvent
	| T
	| undefined;

export type PixiLetDrawCallback<T = undefined> = (utils: PixiLetUtils, event: PixiLetDrawCallbackEvent<T>) => Awaitable<void>;
export type Awaitable<T> = T | Promise<T>;
