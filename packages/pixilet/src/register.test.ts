import * as PIXI from "pixi.js";
import { describe, it } from "vitest";

describe.concurrent("register", () => {
	it("should register the plugin", async ({ expect }) => {
		expect(window.L).toBeUndefined();

		await import("leaflet");

		expect(window.L).toBeDefined();
		expect(window.L.pixiLetLayer).toBeUndefined();
		expect(window.L.PixiLetLayer).toBeUndefined();

		expect(window.PIXI).toBeUndefined();
		window.PIXI = PIXI;
		expect(window.PIXI).toBeDefined();

		await import("./register.js");

		expect(window.L.pixiLetLayer).toBeInstanceOf(Function);
		expect(window.L.PixiLetLayer).toBeDefined();
	});
});
