/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from "leaflet";
import * as PIXI from "pixi.js";
import { describe, it } from "vitest";

import type { IPixiLetLayer } from "../types.js";
import { setOptions } from "./setOptions.js";

describe.concurrent("setOptions", () => {
	it("should set the options of an object", ({ expect }) => {
		const thisObject = {
			options: {},
		};

		setOptions.call(thisObject as IPixiLetLayer, L, PIXI);

		expect(thisObject.options).toEqual(expect.objectContaining({
			container: expect.any(PIXI.Container),
			doubleBuffering: false,
			padding: 0.1,
			projectionZoom: expect.any(Function),
			renderer: {
				antialias: true,
				backgroundAlpha: 0,
				clearBeforeRender: true,
				resolution: 1,
			},
			shouldRedrawOnMove: expect.any(Function),
		}));
	});

	it("should set the options of an object with custom options", ({ expect }) => {
		const thisObject = {
			options: {},
		} as unknown as IPixiLetLayer;

		setOptions.call(thisObject, L, PIXI, {
			renderer: {
				antialias: false,
				backgroundAlpha: 0.5,
				resolution: 2,
			},
			shouldRedrawOnMove: () => true,
		});

		expect(thisObject.options).toEqual(expect.objectContaining({
			container: expect.any(PIXI.Container),
			doubleBuffering: false,
			padding: 0.1,
			projectionZoom: expect.any(Function),
			renderer: {
				antialias: false,
				backgroundAlpha: 0.5,
				clearBeforeRender: true,
				resolution: 2,
			},
			shouldRedrawOnMove: expect.any(Function),
		}));

		expect(thisObject.options.shouldRedrawOnMove(L.map(document.createElement("div")), {
			layer: undefined,
			popup: undefined,
			propagatedFrom: undefined,
			sourceTarget: undefined,
			target: undefined,
			type: "foo",
		})).toBe(true);
	});

	it("should keep prototype properties", ({ expect }) => {
		const thisObject = {
			options: {
				foo: "bar",
			},
		} as unknown as IPixiLetLayer;

		setOptions.call(thisObject, L, PIXI);

		expect(thisObject.options).toEqual(expect.objectContaining({
			container: expect.any(PIXI.Container),
			doubleBuffering: false,
			foo: "bar",
			padding: 0.1,
			projectionZoom: expect.any(Function),
			renderer: {
				antialias: true,
				backgroundAlpha: 0,
				clearBeforeRender: true,
				resolution: 1,
			},
			shouldRedrawOnMove: expect.any(Function),
		}));
	});
});
