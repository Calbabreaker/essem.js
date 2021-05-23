import { assert, AssertionError } from "src/utils/misc";

test("ESSEM.assert()", () => {
    expect(() => assert(false)).toThrowError(new AssertionError());
    expect(() => assert(false, "NONONONONO")).toThrowError(new AssertionError("NONONONONO"));
    expect(() => assert(true)).not.toThrow();
});
