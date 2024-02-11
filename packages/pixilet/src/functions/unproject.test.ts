import * as L from "leaflet";
import { describe, it } from "vitest";

import { unproject } from "./unproject.js";

describe.concurrent("unproject", () => {
	it("should unproject a single value", ({ expect }) => {
		// ? Create a map instance
		const map = L.map(document.createElement("div")).setView([51.505, -0.09], 1),
			unprojectFunction = unproject(L, map, 1);
		//* Expect the unprojectFunction to be a function
		expect(unprojectFunction).toBeTypeOf("function");
		expect(unprojectFunction({
			x: 255.872,
			y: 170.258_551_462_728_8,
		})).toEqual(expect.objectContaining(
			{
				lat: 51.505,
				lng: -0.089_999_999_999_990_1,
			},
		));

		// ? Test the zoom parameter
		expect(unprojectFunction({
			x: 511.744,
			y: 340.517_102_925_457_6,
		}, 2)).toEqual(expect.objectContaining({
			lat: 51.505,
			lng: -0.089_999_999_999_990_1,
		}));
	});
});
