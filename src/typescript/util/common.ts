export function qsa(selector: string, parent: HTMLElement | Document = document): Element[] {
	return [...parent.querySelectorAll(selector)];
}

export function inject(selector: string, html: string) {
	document.querySelector(selector)?.insertAdjacentHTML('beforeend', html);
}
