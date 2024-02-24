import { defineConfig } from "vite";

import { version } from "./package.json";

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: "src/register.ts",
			fileName: "pixilet",
			formats: ["umd"],
			name: "Pixilet",
		},
		outDir: "lib",
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
