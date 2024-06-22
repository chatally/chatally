import { StringWritable, TestError } from "@internal/test-utils";
import { BaseLogger } from "./base-logger.js";

/** @param {import("./index.d.ts").LoggerOptions | undefined} [options] */
function getLogger(options) {
  const actual = new StringWritable();
  const log = new BaseLogger(options);
  log.out = actual;
  log.timestamp = false;
  return { log, actual };
}

describe("BaseLogger", function () {
  it("logs on info level by default", () => {
    const { log, actual } = getLogger();
    log.info("foo");
    log.debug("bar");

    expect(actual.data).toBe("INFO: foo\n");
  });

  it("logs with a named child logger", () => {
    const { log, actual } = getLogger({ name: "parent" });
    const child = log.child({ name: "child", level: "debug" });
    child.debug("bar");

    expect(actual.data).toBe("DEBUG (parent/child): bar\n");
  });

  it("logs data", () => {
    const { log, actual } = getLogger();
    log.info({ bar: "bar" }, "bar");

    expect(actual.data).toBe(`INFO: bar
{
  "bar": "bar"
}
`);
  });

  it("merges child data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    const child = log.child({ data: { bar: "bar" } });
    child.info({ baz: "baz" }, "baz");

    expect(actual.data).toBe(`INFO: baz
{
  "foo": "foo",
  "bar": "bar",
  "baz": "baz"
}
`);
  });

  it("merges logger data and logged data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.info({ bar: "bar" }, "bar");

    expect(actual.data).toBe(`INFO: bar
{
  "foo": "foo",
  "bar": "bar"
}
`);
  });

  it("merges logger data and strange data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.info(73, "bar");

    expect(actual.data).toBe(`INFO: bar
[
  {
    "foo": "foo"
  },
  73
]
`);
  });

  it("merges logger data and logged error", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.error(new TestError("Boom", { test: "Test" }), "Expected");

    expect(actual.data).toBe(`ERROR: Expected
{
  "foo": "foo",
  "error": {
    "message": "Boom",
    "test": "Test"
  }
}
`);
  });

  it("logs a simple error", () => {
    const { log, actual } = getLogger();
    log.error(new Error("Boom"));

    expect(actual.data).toBe(`ERROR: Boom
`);
  });

  it("logs an error with properties", () => {
    const { log, actual } = getLogger();
    log.error(new TestError("Boom", { prop: "Prop" }));

    expect(actual.data).toBe(`ERROR:
{
  "message": "Boom",
  "prop": "Prop"
}
`);
  });
});
