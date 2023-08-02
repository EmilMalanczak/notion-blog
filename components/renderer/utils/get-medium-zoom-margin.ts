export function getMediumZoomMargin() {
    const width = window.innerWidth;

    if (width < 500) {
        return 8;
    }
    if (width < 800) {
        return 20;
    }
    if (width < 1280) {
        return 30;
    }
    if (width < 1600) {
        return 40;
    }
    if (width < 1920) {
        return 48;
    }
    return 72;
}
