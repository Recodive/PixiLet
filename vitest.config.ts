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
				branches: 64.61,
				functions: 86.11,
				lines: 82.3,
				statements: 80.27,
			},
		},
		isolate: false,
		passWithNoTests: true,
	},
});
