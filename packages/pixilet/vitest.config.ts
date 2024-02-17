import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		browser: {
			enabled: true,
			isolate: true,
			name: "firefox",
			provider: "playwright",
		},
		isolate: true,
	},
});
