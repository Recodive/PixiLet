import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			enabled: true,
			reportOnFailure: true,
			thresholds: {
				autoUpdate: true,
				branches: 0,
				functions: 0,
				lines: 39.31,
				statements: 39.31,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
