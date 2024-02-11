import * as L from "leaflet";
import { describe, it } from "vitest";

import { projectionZoom } from "./projectionZoom.js";

describe.concurrent("projectionZoom", () => {
	it("should return the average of the max and min zoom", ({ expect }) => {
		const map = L.map(document.createElement("div"), {
			maxZoom: 20,
			minZoom: 0,
		}).setView([51.505, -0.09], 1);
		expect(projectionZoom(map)).toEqual(10);

		map.setMaxZoom(15);

		expect(projectionZoom(map)).toEqual(7.5);

		map.setMinZoom(5);

		expect(projectionZoom(map)).toEqual(10);
	});

	it("should return the min zoom + 8 if the max zoom is infinity", ({ expect }) => {
		const map = L.map(document.createElement("div"), {
			maxZoom: Number.POSITIVE_INFINITY,
			minZoom: 0,
		}).setView([51.505, -0.09], 1);
		expect(projectionZoom(map)).toEqual(8);

		map.setMinZoom(5);

		expect(projectionZoom(map)).toEqual(13);
	});
});
