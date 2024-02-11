import * as L from "leaflet";
import { describe, it } from "vitest";

import { project } from "./project.js";

describe.concurrent("project", () => {
	it("should project a single value", ({ expect }) => {
		// ? Create a map instance
		const map = L.map(document.createElement("div")).setView([51.505, -0.09], 1),
			projectFunction = project(L, map, 1);
		//* Expect the projectFunction to be a function
		expect(projectFunction).toBeTypeOf("function");
		expect(projectFunction({
			lat: 51.505,
			lng: -0.09,
		})).toEqual(expect.objectContaining({
			x: 255.872,
			y: 170.258_551_462_728_8,
		}));

		// ? Test the zoom parameter
		expect(projectFunction({
			lat: 51.505,
			lng: -0.09,
		}, 2)).toEqual(expect.objectContaining({
			x: 511.744,
			y: 340.517_102_925_457_6,
		}));
	});
});
