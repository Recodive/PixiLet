import * as L from "leaflet";
import { describe, it } from "vitest";

import { setupToggleRounding } from "./toggleRounding.js";

describe.concurrent("toggleRounding", () => {
	it("should toggle the rounding of a number", ({ expect }) => {
		const toggler = setupToggleRounding(L);
		toggler(true);

		expect(L.point(1.5, 1.5).round()).toEqual(L.point(2, 2));

		toggler(false);

		expect(L.point(1.5, 1.5).round()).toEqual(L.point(1.5, 1.5));

		toggler(true);
	});
});
