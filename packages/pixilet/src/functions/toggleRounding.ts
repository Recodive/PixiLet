import type { Point } from "leaflet";

function noRound(this: Point) {
	return this;
}

export function setupToggleRounding(L: typeof import("leaflet")) {
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const round = L.Point.prototype._round;
	return (shouldRound: boolean) => {
		L.Point.prototype._round = shouldRound ? round : noRound;
	};
}
