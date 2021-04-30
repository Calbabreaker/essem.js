import { Vector2 } from "src/math/vector2";

describe("ESSEM.Vector2", () => {
    test("should generate Vector2", () => {
        const vector = new Vector2(123, 855);
        expect(vector.x).toBe(123);
        expect(vector.y).toBe(855);

        const vectorDefault = new Vector2();
        expect(vectorDefault.x).toBe(0);
        expect(vectorDefault.y).toBe(0);
    });

    test("set()", () => {
        const vector = new Vector2(55, 55);
        vector.set(15, 9);
        expect(vector.x).toBe(15);
        expect(vector.y).toBe(9);
    });

    test("setVector()", () => {
        const vector = new Vector2(55, 55);
        const vector2 = new Vector2(928, 845);
        vector.setVector(vector2);
        expect(vector.x).toBe(928);
        expect(vector.y).toBe(845);
    });
});
