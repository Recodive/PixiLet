import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			enabled: true,
			reportOnFailure: true,
			thresholds: {
				autoUpdate: true,
				branches: 100,
				functions: 54.83,
				lines: 74.5,
				statements: 74.5,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
