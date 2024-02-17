import * as L from "leaflet";
import { describe, it } from "vitest";

import type { IPixiLetLayer } from "../types.js";
import { setPosition } from "./setPosition.js";

describe("setPosition", () => {
	it("should set the position of the layer", ({ expect }) => {
		const map = L.map(document.createElement("div"), {
				maxZoom: 20,
				minZoom: 0,
			}).setView([51.505, -0.09], 1),
			layer = {
				_container: document.createElement("div"),
				_map: map,
				options: {
					padding: 0.5,
				},
			};

		expect(layer._container.getAttribute("style")).toBeNull();
		expect((layer._container as { _leaflet_pos: Record<string, unknown> } & HTMLDivElement)._leaflet_pos).toBeUndefined();

		setPosition.call(layer as unknown as IPixiLetLayer, L, layer._map.getCenter(), layer._map.getZoom());

		expect((layer._container as { _leaflet_pos: Record<string, unknown> } & HTMLDivElement)._leaflet_pos).toMatchObject({ x: -0.127_999_999_999_985_9, y: 0.258_551_462_728_803_47 });
		expect(layer._container.getAttribute("style")).toEqual("left: -0.1279999999999859px; top: 0.25855146272880347px;");
	});
});
