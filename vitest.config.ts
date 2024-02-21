import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			enabled: true,
			provider: "istanbul",
			reportOnFailure: true,
			thresholds: {
				autoUpdate: true,
				branches: 83.07,
				functions: 97.22,
				lines: 99.23,
				statements: 95.91,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
