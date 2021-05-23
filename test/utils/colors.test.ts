import { hexToRGBA } from "src/utils/colors";

test("ESSEM.hexToRGBA", () => {
    const implicitAlpha = hexToRGBA(0x123456);
    expect(implicitAlpha.length).toBe(4);
    expect(implicitAlpha[0]).toBeCloseTo(0x12 / 255);
    expect(implicitAlpha[1]).toBeCloseTo(0x34 / 255);
    expect(implicitAlpha[2]).toBeCloseTo(0x56 / 255);
    expect(implicitAlpha[3]).toBe(1);

    const explicitAlpha = hexToRGBA(0x12345678);
    expect(explicitAlpha.length).toBe(4);
    expect(explicitAlpha[0]).toBeCloseTo(0x12 / 255);
    expect(explicitAlpha[1]).toBeCloseTo(0x34 / 255);
    expect(explicitAlpha[2]).toBeCloseTo(0x56 / 255);
    expect(explicitAlpha[3]).toBeCloseTo(0x78 / 255);
});
