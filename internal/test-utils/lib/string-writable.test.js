import { StringWritable } from "./string-writable.js";

describe("StringWritable", function () {
  it("writes to the buffer", () => {
    const sw = new StringWritable();
    sw.write("Foo");
    expect(sw.data).toBe("Foo");
  });

  it("throws, when writing to closed stream", async () => {
    let error = new Error("no error");
    await new Promise((resolve) => {
      const sw = new StringWritable()
        .on("finish", resolve)
        .on("error", (err) => (error = err));
      sw.write("Foo");
      sw.end();
      sw.write("Bar");
    });
    expect(error.message).toBe("write after end");
  });
});
