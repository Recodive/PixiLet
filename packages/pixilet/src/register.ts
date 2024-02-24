/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/prefer-module */
import { register } from "./index.js";

(() => {
	/* istanbul ignore next -- @preserve */
	if (typeof define === "function" && /* istanbul ignore next -- @preserve */ define.amd) {
		//* AMD
		define(["leaflet", "pixi.js"], register);
	} else if (typeof module === "undefined") {
		//* Browser globals
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (window.L === undefined) throw new Error("Leaflet must be loaded first");
		if (window.PIXI === undefined) throw new Error("Pixi.js must be loaded first");
		register(window.L, window.PIXI);
	} else {
		//* Node/CommonJS
		// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unsafe-argument
		module.exports = register(require("leaflet"), require("pixi.js"));
	}
})();
