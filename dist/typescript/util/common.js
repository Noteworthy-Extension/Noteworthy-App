export function qsa(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}
export function inject(selector, html) {
    document.querySelector(selector)?.insertAdjacentHTML('beforeend', html);
}
