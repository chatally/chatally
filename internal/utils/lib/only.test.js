import { only } from "./only.js";

describe("only", function () {
  test("simple object", () => {
    const obj = { foo: "foo", bar: "bar" };
    const actual = only(obj, ["foo"]);
    const expected = { foo: "foo" };
    expect(actual).toStrictEqual(expected);
  });
  test("class instance", () => {
    const obj = new TestClass();
    const actual = only(obj, ["foo", "getter", "barValue"]);
    expect(actual.foo).toBe(obj.foo);
    expect(actual.bar).toBeUndefined();
    expect(actual.getter).toBe(obj.getter);
    expect(actual.barValue).toBe(obj.barValue);
    // @ts-ignore
    expect(actual.barValue()).toBe("value: undefined");
  });
});

class TestClass {
  foo = "foo";
  bar = "bar";
  get getter() {
    return "getter";
  }
  barValue() {
    return "value: " + this.bar;
  }
}
