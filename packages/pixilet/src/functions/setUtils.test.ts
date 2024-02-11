/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as L from "leaflet";
import * as PIXI from "pixi.js";
import { describe, it } from "vitest";

import type { IPixiLetLayer } from "../types.js";
import { setOptions } from "./setOptions.js";
import { setUtils } from "./setUtils.js";

describe.concurrent("setUtils", () => {
	it("should set the util functions as an util object", ({ expect }) => {
		const thisObject = {
			utils: {},
		};

		setUtils.call(thisObject as IPixiLetLayer, L);

		expect(thisObject.utils).toEqual(expect.objectContaining({
			getContainer: expect.any(Function),
			getMap: expect.any(Function),
			getRenderer: expect.any(Function),
			getScale: expect.any(Function),
			project: expect.any(Function),
			render: expect.any(Function),
			unproject: expect.any(Function),
		}));
	});

	it("getContainer should return the container if it exists, or the default container", ({ expect }) => {
		const thisObject = {
			_pixiContainer: {},
			utils: {},
		} as unknown as IPixiLetLayer;

		setUtils.call(thisObject, L);

		expect(thisObject.utils.getContainer()).toEqual({});

		delete (thisObject as {
			_pixiContainer?: unknown;
		})._pixiContainer;
		setOptions.call(thisObject, L, PIXI);

		expect(thisObject.utils.getContainer()).toEqual(thisObject.options.container);
	});

	it("getMap should return the map", ({ expect }) => {
		const thisObject = {
			_map: {},
			utils: {},
		} as unknown as IPixiLetLayer;

		setUtils.call(thisObject, L);

		expect(thisObject.utils.getMap()).toEqual({});
	});

	it("getRenderer should return the renderer", ({ expect }) => {
		const thisObject = {
			_renderer: {},
			utils: {},
		} as unknown as IPixiLetLayer;

		setUtils.call(thisObject, L);

		expect(thisObject.utils.getRenderer()).toEqual({});
	});

	it("getScale should return the zoom scale", ({ expect }) => {
		const thisObject = {
			_initialZoom: 0,
			_map: {
				getZoom: () => 0,
				getZoomScale: (zoom: number) => zoom,
			},
			utils: {},
		} as unknown as IPixiLetLayer;

		setUtils.call(thisObject, L);

		expect(thisObject.utils.getScale()).toEqual(0);
		expect(thisObject.utils.getScale(1)).toEqual(1);
	});

	it("render should render the container", ({ expect }) => {
		const thisObject = {
			_renderer: {
				render: () => {
					/* noop */
				},
			},
			options: {
				container: new PIXI.Container(),
			},
			utils: {},
		} as unknown as IPixiLetLayer;

		setUtils.call(thisObject, L);

		expect(() => {
			thisObject.utils.render();
		}).not.toThrow();
	});
});
