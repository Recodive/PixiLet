import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import dts from "vite-plugin-dts";

import { version } from "./package.json";

export default defineConfig({
	build: {
		emptyOutDir: false,
		lib: {
			entry: {
				index: "src/index.ts",
				register: "src/register.ts",
			},
			formats: ["es", "cjs"],
			name: "Pixilet",
		},
		outDir: "lib",
		rollupOptions: {
			external: ["leaflet", "pixi.js"],
			output: {
				banner: `/* PixiLet v${version} */`,
				exports: "named",
				globals: {
					leaflet: "L",
					"pixi.js": "PIXI",
				},
			},
		},
		sourcemap: true,
	},
	plugins: [
		checker({
			typescript: true,
		}),
		dts({
			exclude: ["vite.config.*"],
		}),
	],
});
