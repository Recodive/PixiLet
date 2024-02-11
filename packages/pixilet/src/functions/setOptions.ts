import type { DeepPartial, IPixiLetLayer, PixiLetOptions } from "../types.js";
import { projectionZoom } from "./projectionZoom.js";

export function setOptions(this: IPixiLetLayer, L: typeof import("leaflet"), PIXI: typeof import("pixi.js"), options?: DeepPartial<PixiLetOptions>) {
	options ??= {};
	options.container ??= new PIXI.Container();
	options.doubleBuffering ??= false;
	options.padding ??= 0.1;
	options.projectionZoom ??= projectionZoom;
	/* c8 ignore next */ // ? Covered
	options.shouldRedrawOnMove ??= () => false;
	options.renderer ??= {
		antialias: true,
		backgroundAlpha: 0,
		clearBeforeRender: true,
		/* c8 ignore next */ // ? Can't test L.Browser.retina
		resolution: L.Browser.retina ? 2 : 1,
	};
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	options.renderer.antialias ??= true;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	options.renderer.backgroundAlpha ??= 0;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	options.renderer.clearBeforeRender ??= true;
	/* c8 ignore next 2 */ // ? Can't test L.Browser.retina
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
		for (const property of op) if (!names.includes(property)) names.push(property);
	}
	const defaultProperties = Object.getOwnPropertyNames(Object.getPrototypeOf({}));
	names = names.filter(name => !defaultProperties.includes(name));
	const properties: Record<string, unknown> = {};
	for (const name of names) properties[name] = (startObject as Record<string, unknown>)[name];
	return properties as T;
}
