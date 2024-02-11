import type { Map } from "leaflet";

export function projectionZoom(map: Map) {
	const maxZoom = map.getMaxZoom(),
		minZoom = map.getMinZoom();
	if (maxZoom === Number.POSITIVE_INFINITY) return minZoom + 8;

	return (maxZoom + minZoom) / 2;
}
