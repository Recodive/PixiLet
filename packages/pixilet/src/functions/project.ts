import type { LatLngLiteral, LatLngTuple, Map, Point } from "leaflet";

export type LatLngCoords =
	| LatLngTuple
	| [number, number, number]
	| LatLngLiteral
	| {
		lat: number;
		lng: number;
		alt?: number | undefined;
	};

export function project(L: typeof import("leaflet"), map: Map, initialZoom: number): (latLng: LatLngCoords, zoom?: number | undefined) => Point {
	return (coords, zoom) => map.project(L.latLng(coords), zoom ?? initialZoom);
}
