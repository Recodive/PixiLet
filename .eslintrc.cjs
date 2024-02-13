//* Patches eslint's module resolution
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	extends: ["@recodive/eslint-config/strict"],
	overrides: [
		{
			extends: ["plugin:@typescript-eslint/disable-type-checked"],
			files: ["./**/*.{cjs,js,jsx}"],
		},
	],
	parserOptions: {
		project: "./tsconfig.json",
	},
};
