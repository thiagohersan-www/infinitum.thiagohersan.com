const urlParams = new URLSearchParams(window.location.search);
const AUTO_SCROLL = urlParams.has("autoScroll");
const AUTO_SCROLL_SPEED = parseFloat(urlParams.get("autoScroll")) || 1.0;

export { AUTO_SCROLL, AUTO_SCROLL_SPEED };
