import type { DeepPartial, IPixiLetLayer, PixiLetOptions } from "../types.js";
import { projectionZoom } from "./projectionZoom.js";

export function setOptions(this: IPixiLetLayer, L: typeof import("leaflet"), PIXI: typeof import("pixi.js"), options?: DeepPartial<PixiLetOptions>) {
	options ??= {};
	options.container ??= new PIXI.Container();
	options.doubleBuffering ??= false;
	options.padding ??= 0.1;
	options.projectionZoom ??= projectionZoom;
	/* istanbul ignore next -- @preserve */ // ? Covered
	options.shouldRedrawOnMove ??= () => false;
	/* istanbul ignore next -- @preserve */ // ? Can't test L.Browser.retina
	options.renderer ??= {
		antialias: true,
		backgroundAlpha: 0,
		clearBeforeRender: true,
		resolution: L.Browser.retina ? 2 : 1,
	};
	options.renderer.antialias ??= true;
	options.renderer.backgroundAlpha ??= 0;
	options.renderer.clearBeforeRender ??= true;
	/* istanbul ignore next -- @preserve */ // ? Can't test L.Browser.retina
	options.renderer.resolution ??= L.Browser.retina ? 2 : 1;

	this.options = {
		...getAllProperties(this.options),
		...options,
	} as PixiLetOptions;
}

function getAllProperties<T = Record<string, unknown>>(startObject: T): T {
	let names: string[] = [],
		object = startObject;
	for (; !!object && typeof object === "object"; object = Object.getPrototypeOf(object) as T) {
		const op = Object.getOwnPropertyNames(object);
		/* istanbul ignore next -- @preserve */ // ? Covered
		for (const property of op) if (!names.includes(property)) names.push(property);
	}
	const defaultProperties = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
	names = names.filter(name => !defaultProperties.includes(name));
	const properties: Record<string, unknown> = {};
	for (const name of names) properties[name] = (startObject as Record<string, unknown>)[name];
	return properties as T;
}
