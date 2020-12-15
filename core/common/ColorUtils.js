export function getColor (sKey) {
    return window.getComputedStyle(document.documentElement).getPropertyValue(sKey);
}
