import type { LatLng, Map, PointTuple } from "leaflet";

export type PointCoords = PointTuple | { x: number; y: number };

export function unproject(L: typeof import("leaflet"), map: Map, initialZoom: number): (point: PointCoords, zoom?: number | undefined) => LatLng {
	return (coords, zoom) => map.unproject(L.point(coords), zoom ?? initialZoom);
}
