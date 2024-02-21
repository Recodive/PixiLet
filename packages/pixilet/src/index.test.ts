import * as L from "leaflet";
import * as PIXI from "pixi.js";
import { describe, expect, it, vitest } from "vitest";

import { register } from "./index.js";

describe("register()", () => {
	it("registers the plugin", () => {
		expect(register).toBeInstanceOf(Function);
		expect(L.pixiLetLayer).toBeUndefined();
		expect(L.PixiLetLayer).toBeUndefined();

		register(L, PIXI);

		expect(L.pixiLetLayer).toBeInstanceOf(Function);
		expect(L.PixiLetLayer).toBeDefined();
	});

	describe("pixiLetLayer()", () => {
		it("returns a new PixiLetLayer", () => {
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
			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});
	});

	describe("new PixiLetLayer()", () => {
		it("creates a new PixiLetLayer", () => {
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = new L.PixiLetLayer(spy, {
					container,
				});
			expect(layer).toBeInstanceOf(L.PixiLetLayer);
			expect(spy).not.toHaveBeenCalled();
			expect(layer.options.padding).toBe(0.1);

			const map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);
			expect(map.hasLayer(layer)).toBe(false);
			expect(layer.addTo(map)).toBe(layer);
			expect(map.hasLayer(layer)).toBe(true);

			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));
			expect(spy).toHaveBeenCalledTimes(1);

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});

		it("creates a new PixiLetLayer (with doubleBuffering)", async () => {
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = new L.PixiLetLayer(spy, {
					container,
					doubleBuffering: true,
				});
			expect(layer).toBeInstanceOf(L.PixiLetLayer);
			expect(spy).not.toHaveBeenCalled();
			expect(layer.options.padding).toBe(0.1);

			const map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);
			expect(map.hasLayer(layer)).toBe(false);
			expect(layer.addTo(map)).toBe(layer);
			expect(map.hasLayer(layer)).toBe(true);

			await new Promise(resolve => setTimeout(resolve, 1000));
			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));
			expect(spy).toHaveBeenCalledTimes(1);

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});

		it("redraw()", async () => {
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = new L.PixiLetLayer(spy, {
					container,
				}), map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);

			expect(map.hasLayer(layer)).toBe(false);
			await layer.redraw();
			expect(spy).toHaveBeenCalledTimes(0);

			layer.addTo(map);

			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));
			expect(spy).toHaveBeenCalledTimes(1);

			await layer.redraw({ type: "test" });

			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "test" }));
			expect(spy).toHaveBeenCalledTimes(2);

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});

		it("moveend", async () => {
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = new L.PixiLetLayer(spy, {
					container,
				}), map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);

			layer.addTo(map);

			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));
			expect(spy).toHaveBeenCalledTimes(1);

			map.setZoom(14);

			await new Promise(resolve => setTimeout(resolve, 1000));
			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "moveend" }));
			expect(spy).toHaveBeenCalledTimes(2);

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});

		it("moveend (with shouldRedrawOnMove)", async () => {
			const spy = vitest.fn(),
				container = new PIXI.Container(),
				layer = new L.PixiLetLayer(spy, {
					container,
					shouldRedrawOnMove: () => true,
				}), map = L.map(document.createElement("div")).setView([51.505, -0.09], 13);

			layer.addTo(map);

			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "add" }));
			expect(spy).toHaveBeenCalledTimes(1);

			map.setZoom(14);

			await new Promise(resolve => setTimeout(resolve, 1000));
			expect(spy).toHaveBeenCalledWith(layer.utils, expect.objectContaining({ type: "moveend" }));
			expect(spy).toHaveBeenCalledTimes(3);

			layer.destroy();

			expect(map.hasLayer(layer)).toBe(false);
		});
	});
});
