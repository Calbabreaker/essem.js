export function test(): void {
    console.log("Hello testing yary");
}

declare global {
    interface Window {
        ESSEM: {};
    }
}

if (typeof window !== "undefined") {
    if (window.ESSEM != null) {
        console.warn("ESSEM has been imported multiple times!");
    }
}
