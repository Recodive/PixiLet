declare global {
	//* Add a type definition to the window for the `L` and `PIXI` global variables
	interface Window {
		L: typeof import("leaflet") | undefined;
		PIXI: typeof import("pixi.js") | undefined;
	}
	//* also add the `define` function for AMD modules
	const define:
		| (((deps: string[], factory: (L: typeof import("leaflet"), PIXI: typeof import("pixi.js")) => void) => void) & {
			amd?: boolean;
		})
		| undefined;
}

declare module "leaflet" {
	interface Point {
		_round(): this;
		_subtract(point: Point): this;
	}

	interface Map {
		_animatingZoom: boolean;
		_getNewPixelOrigin(center: LatLng, zoom: number): Point;
	}

	interface Layer {
		_zoomAnimated: boolean;
	}
}

declare module "pixi.js" {
	interface ICanvasStyle {
		position?: string;
		visibility?: string;
	}

	interface IRenderer {
		size?: Point;
		rootRenderTarget?: {
			resolution: number;
		};
		gl?: WebGLRenderingContext;
	}
}

export { };
