import { getLogger, getNoLogger } from "@chatally/logger";
import { createApplication } from "./application.js";
import { createRequest as req } from "./request.js";
import { createResponse } from "./response.js";
import { StringWritable } from "@internal/utils";

/**
 * @type {import("./types.d.ts").Middleware<{}>}
 */
const echo = (ctx) => {
  ctx.req.messages.forEach((msg) => ctx.res.write(`Echo: '${msg}'`));
};

describe("Application", function () {
  it("dispatches to middleware", async () => {
    const app = createApplication().use(echo);

    const res = createResponse();
    await app.callback(req("foo"), res);
    expect(res.messages).toStrictEqual(["Echo: 'foo'"]);
    expect(res.error).toBe(undefined);
  });

  it("dispatches in order of registration", async () => {
    const app = createApplication()
      .use(function a(ctx) {
        // should run before all middlewares
        ctx.res.write("a");
      })
      .use(async function b(ctx, next) {
        // should run after all following middlewares
        await next();
        ctx.res.write("b");
      })
      .use(async function c(ctx, next) {
        // should run before and after all following middlewares
        ctx.res.write("c-pre");
        await next();
        ctx.res.write("c-post");
      })
      .use(async function d(ctx) {
        await new Promise((resolve) => setTimeout(resolve, 1));
        ctx.res.write("d");
      })
      .use(function e(ctx) {
        ctx.res.write("e");
      });

    const res = createResponse();
    await app.callback(req("foo"), res);
    expect(res.messages).toStrictEqual(["a", "c-pre", "d", "e", "c-post", "b"]);
  });

  it("catches all middleware errors", async () => {
    const app = createApplication()
      .use(echo)
      .use(function throws() {
        throw new Error("Boom");
      });

    const res = createResponse();
    await app.callback(req("foo"), res);
    expect(res.messages).toStrictEqual(["Echo: 'foo'"]);
    expect(res.error?.message).toBe("Boom");
  });

  it("exposes errors if demanded", async () => {
    const app = createApplication()
      .use(echo)
      .use(function throws(ctx) {
        ctx.throw("Boom", { expose: true, statusCode: 501 });
      });

    const res = createResponse();
    await app.callback(req("foo"), res);
    expect(res.error?.message).toBe("Boom");
    expect(res.error?.statusCode).toBe(501);
    expect(res.messages).toStrictEqual(["Echo: 'foo'", "Boom"]);
  });

  it("warns about unnamed middleware", async () => {
    const out = new StringWritable();
    const log = getLogger({ name: "root", level: "warn" });
    log.out = out;
    log.timestamps = false;

    createApplication({ log })
      // unnamed middleware
      .use(() => {});
    expect(out.data.startsWith("WARN (root):")).toBeTruthy();
  });

  it("logs middleware output", async () => {
    const out = new StringWritable();
    const log = getLogger({ level: "warn" });
    log.out = out;
    log.timestamps = false;

    const app = createApplication({ log }) //
      .use(function logs(_ctx, _next, log) {
        log.level = "debug";
        log.debug("Hello");
      });

    const res = createResponse();
    await app.callback(req("foo"), res);
    expect(out.data).toBe("DEBUG (logs): Hello\n");
  });
});
