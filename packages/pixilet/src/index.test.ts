import * as L from "leaflet";
import * as PIXI from "pixi.js";
import { describe, expect, it, vitest } from "vitest";

import { register } from "./index.js";

describe("register()", () => {
	it("registers the plugin", () => {
		expect(register).toBeInstanceOf(Function);
		expect(L.pixiLetLayer).toBeUndefined();
		expect(L.PixiLetLayer).toBeUndefined();

		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-var-requires, unicorn/prefer-module
		register(require("leaflet"), require("pixi.js"));

		expect(L.pixiLetLayer).toBeInstanceOf(Function);
		expect(L.PixiLetLayer).toBeDefined();
	});

	describe("pixiLetLayer()", () => {
		it.todo("returns a new PixiLetLayer", () => {
			expect(L.pixiLetLayer).toBeInstanceOf(Function);
			expect(L.pixiLetLayer(() => { /* test */ })).toBeInstanceOf(L.PixiLetLayer);
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = L.pixiLetLayer(spy, {
					container,
					padding: 1,
				});
			expect(layer).toBeInstanceOf(L.PixiLetLayer);
			expect(spy).not.toHaveBeenCalled();
			expect(layer.options.padding).toBe(1);

			const map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);
			expect(map.hasLayer(layer)).toBe(false);
			expect(layer.addTo(map)).toBe(layer);
			expect(map.hasLayer(layer)).toBe(true);
			expect(spy).toHaveBeenCalled();
		});
	});

	describe.todo("new PixiLetLayer()", () => {
		it.todo("creates a new PixiLetLayer", () => {
			// TODO
		});

		it.todo("sets the options", () => {
			// TODO
		});
	});
});
