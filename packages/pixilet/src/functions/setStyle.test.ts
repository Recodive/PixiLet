import { IRenderer } from "pixi.js";
import { describe, it } from "vitest";

import { setStyle } from "./setStyle.js";

describe.concurrent("setStyle", () => {
	it("should set the style of an element", ({ expect }) => {
		const element = document.createElement("div");
		setStyle(element, {
			backgroundColor: "red",
		});

		expect(element.style.backgroundColor).toEqual("red");
	});

	it("should set the style of a renderer", ({ expect }) => {
		const renderer = {
			view: document.createElement("canvas"),
		};
		setStyle(renderer as unknown as IRenderer, {
			backgroundColor: "red",
		});

		expect(renderer.view.style.backgroundColor).toEqual("red");
	});

	it("should not set the style of an undefined element, or no style object exists", () => {
		// ? These are just tests to cover the branches
		setStyle(undefined, {
			backgroundColor: "red",
		});

		setStyle({} as IRenderer, {
			backgroundColor: "red",
		});
	});
});
