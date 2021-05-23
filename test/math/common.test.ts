import { approxEquals, DEG_TO_RAD, RAD_TO_DEG, toDegrees, toRadians } from "src/math/common";

test("ESSEM.approxEquals()", () => {
    const a = 0.01111111111111111;
    expect(approxEquals(a, 0.011)).toBe(true);
    expect(approxEquals(a, 0.1)).toBe(false);
    expect(approxEquals(a, 0.6, 1)).toBe(true);
});

test("ESSEM.DEG_TO_RAD", () => {
    expect(DEG_TO_RAD).toBeCloseTo(Math.PI / 180);
});

test("ESSEM.RAD_TO_DEG", () => {
    expect(RAD_TO_DEG).toBeCloseTo(180 / Math.PI);
});

test("ESSEM.toRadians", () => {
    const radians = toRadians(180);
    expect(radians).toBeCloseTo(Math.PI);
});

test("ESSEM.toDegrees", () => {
    const degrees = toDegrees(Math.PI);
    expect(degrees).toBeCloseTo(180);
});
