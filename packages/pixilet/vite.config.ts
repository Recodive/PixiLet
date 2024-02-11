// vite.config.js

import { defineConfig } from "vite";

import { version } from "./package.json";

export default defineConfig({
	build: {
		lib: {
			entry: "src/register.ts",
			formats: ["umd"],
			name: "PixiLet",
		},
		outDir: "lib/umd",
		rollupOptions: {
			external: ["leaflet", "pixi.js"],
			output: {
				banner: `/* PixiLet v${version} */`,
				globals: {
					leaflet: "L",
					"pixi.js": "PIXI",
				},
			},
		},
		sourcemap: true,
	},
});
