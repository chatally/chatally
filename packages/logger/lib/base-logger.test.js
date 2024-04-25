import { StringWritable } from "@internal/utils";
import { BaseLogger, newBaseLogger } from "./base-logger.js";

/**
 * @param {import("./types.d.ts").LoggerOptions | undefined} [options]
 */
function getLogger(options) {
  const actual = new StringWritable();
  const log = newBaseLogger(options);
  log.out = actual;
  log.timestamps = false;
  return { log, actual };
}

describe("BaseLogger", function () {
  it("logs without configuration on info level", () => {
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
});
