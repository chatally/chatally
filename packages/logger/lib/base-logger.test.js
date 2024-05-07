import { StringWritable, XError } from "@internal/utils";
import { BaseLogger } from "./base-logger.js";

/**
 * @param {import("./index.js").LoggerOptions | undefined} [options]
 */
function getLogger(options) {
  const actual = new StringWritable();
  const log = new BaseLogger(options);
  log.out = actual;
  log.timestamps = false;
  return { log, actual };
}

describe("BaseLogger", function () {
  it("logs on info level by default", () => {
    const { log, actual } = getLogger();
    log.info("foo");
    log.debug("bar");

    const expected = "INFO: foo\n";
    expect(actual.data).toBe(expected);
  });

  it("logs with a named child logger", () => {
    const { log, actual } = getLogger({ name: "parent" });
    const child = log.child({ name: "child", level: "debug" });
    child.debug("bar");

    const expected = "DEBUG (parent/child): bar\n";
    expect(actual.data).toBe(expected);
  });

  it("logs data", () => {
    const { log, actual } = getLogger();
    log.info({ bar: "bar" }, "bar");

    const expected = `INFO: bar
{
  "bar": "bar"
}
`;
    expect(actual.data).toBe(expected);
  });

  it("merges child data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    const child = log.child({ data: { bar: "bar" } });
    child.info({ baz: "baz" }, "baz");

    const expected = `INFO: baz
{
  "foo": "foo",
  "bar": "bar",
  "baz": "baz"
}
`;
    expect(actual.data).toBe(expected);
  });

  it("merges logger data and logged data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.info({ bar: "bar" }, "bar");

    const expected = `INFO: bar
{
  "foo": "foo",
  "bar": "bar"
}
`;
    expect(actual.data).toBe(expected);
  });

  it("merges logger data and strange data", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.info(73, "bar");

    const expected = `INFO: bar
[
  {
    "foo": "foo"
  },
  73
]
`;
    expect(actual.data).toBe(expected);
  });

  it("merges logger data and logged error", () => {
    const { log, actual } = getLogger({ data: { foo: "foo" } });
    log.error(new XError("Boom", { test: "Test" }), "Expected");

    const expected = `ERROR: Expected
{
  "foo": "foo",
  "error": {
    "message": "Boom",
    "test": "Test"
  }
}
`;
    expect(actual.data).toBe(expected);
  });

  it("logs a simple error", () => {
    const { log, actual } = getLogger();
    log.error(new Error("Boom"));

    const expected = `ERROR: Boom
`;
    expect(actual.data).toBe(expected);
  });

  it("logs an error with properties", () => {
    const { log, actual } = getLogger();
    log.error(new XError("Boom", { prop: "Prop" }));

    const expected = `ERROR:
{
  "message": "Boom",
  "prop": "Prop"
}
`;
    expect(actual.data).toBe(expected);
  });
});
