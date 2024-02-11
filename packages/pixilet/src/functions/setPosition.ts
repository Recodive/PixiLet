import type { LatLng } from "leaflet";

import type { IPixiLetLayer } from "../types.js";

export function setPosition(this: IPixiLetLayer, L: typeof import("Leaflet"), center: LatLng, zoom: number): void {
	const scale = this._map.getZoomScale(zoom, this._map.getZoom()),
		padding = this._map.getSize().multiplyBy(0.5 + this.options.padding),
		currentCenterPoint = this._map.project(this._map.getCenter(), zoom),
		topLeftOffset = padding.multiplyBy(-scale).add(currentCenterPoint).subtract(this._map._getNewPixelOrigin(center, zoom));

	if (L.Browser.any3d) L.DomUtil.setTransform(this._container, topLeftOffset, scale);
	else L.DomUtil.setPosition(this._container, topLeftOffset);
}
