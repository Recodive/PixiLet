import * as L from "leaflet";
import { describe, it } from "vitest";

describe.concurrent("register", () => {
	it("should register the plugin", async ({ expect }) => {
		expect(L.pixiLetLayer).toBeUndefined();
		expect(L.PixiLetLayer).toBeUndefined();

		await import("./register.js");

		expect(L.pixiLetLayer).toBeInstanceOf(Function);
		expect(L.PixiLetLayer).toBeDefined();
	});
});
