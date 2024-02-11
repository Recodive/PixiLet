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
				functions: 51.61,
				lines: 73.2,
				statements: 73.2,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
