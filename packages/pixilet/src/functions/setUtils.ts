import type { IPixiLetLayer } from "../types.js";
import { project } from "./project.js";
import { unproject } from "./unproject.js";

export function setUtils(this: IPixiLetLayer, L: typeof import("leaflet")) {
	this.utils = {
		getContainer: () => (this as {
			_pixiContainer?: import("pixi.js").Container;
		})._pixiContainer ?? this.options.container,
		getMap: () => this._map,
		getRenderer: () => this._renderer,
		getScale: (zoom) => {
			return zoom === undefined ? this._map.getZoomScale(this._map.getZoom(), this._initialZoom) : this._map.getZoomScale(zoom, this._initialZoom);
		},
		project: project(L, this._map, this._initialZoom),
		render: () => { this._renderer.render(this.options.container); },
		unproject: unproject(L, this._map, this._initialZoom),
	};
}
