import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			all: true,
			enabled: true,
			provider: "istanbul",
			reportOnFailure: true,
			thresholds: {
				branches: 70,
				functions: 94,
				lines: 98,
				statements: 95,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
