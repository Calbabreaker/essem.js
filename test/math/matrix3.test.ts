import { Matrix3 } from "src/math/matrix3";

describe("ESSEM.Matrix3", () => {
    test("should generate identity Matrix3", () => {
        const matrix = new Matrix3();
        expect(matrix.xScale).toBe(1);
        expect(matrix.ySkew).toBe(0);
        expect(matrix.xSkew).toBe(0);
        expect(matrix.yScale).toBe(1);
        expect(matrix.xTrans).toBe(0);
        expect(matrix.yTrans).toBe(0);
    });

    test("should generate Matrix3 with values", () => {
        const matrix = new Matrix3(1, 2, 3, 4, 5, 6);
        expect(matrix.xScale).toBe(1);
        expect(matrix.ySkew).toBe(2);
        expect(matrix.xSkew).toBe(3);
        expect(matrix.yScale).toBe(4);
        expect(matrix.xTrans).toBe(5);
        expect(matrix.yTrans).toBe(6);
    });
});
