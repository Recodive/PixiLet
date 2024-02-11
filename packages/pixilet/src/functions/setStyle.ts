import type { IRenderer } from "pixi.js";

export function setStyle(element: HTMLElement | IRenderer | undefined, style: Partial<CSSStyleDeclaration>): void {
	if (!element) return;
	const styleObject = "view" in element ? element.view.style : element.style;
	if (!styleObject) return;

	for (const key in style) styleObject[key as keyof typeof styleObject] = style[key];
}
