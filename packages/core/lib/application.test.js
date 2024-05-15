import { BaseLogger } from "@chatally/logger";
import { StringWritable, XError } from "@internal/utils";
import { Application } from "./application.js";
import { Request } from "./request.js";
import { Response } from "./response.js";

/**
 * @type {import("./middleware.js").Middleware<{}>}
 */
const echo = ({ req, res }) => {
  if (res.isWritable && req.message.type === "text") {
    res.write(`Echo: '${req.message.text}'`);
  }
};

/** @param {string} text */
function req(text) {
  return new Request(`test: ${text}`);
}

/** @param {Response} res */
function messages(res) {
  return res.messages.map((m) => (m.type === "text" ? m.text : m.image));
}

/**
 * @param {import("@chatally/logger").LoggerOptions | undefined} options
 */
function getLogger(options) {
  return BaseLogger.create(options);
}

describe("Application", function () {
  it("dispatches to middleware", async () => {
    const app = new Application().use(echo);

    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(messages(res)).toStrictEqual(["Echo: 'foo'"]);
  });

  it("dispatches in order of registration", async () => {
    const app = new Application()
      .use(function a({ res }) {
        // should run before all middlewares
        res.write("a");
      })
      .use(async function b({ res, next }) {
        // should run after all following middlewares
        await next();
        res.write("b");
      })
      .use(async function c({ res, next }) {
        // should run before and after all following middlewares
        res.write("c-pre");
        await next();
        res.write("c-post");
      })
      .use(async function d({ res }) {
        await new Promise((resolve) => setTimeout(resolve, 1));
        res.write("d");
      })
      .use(function e({ res }) {
        res.write("e");
      });

    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(messages(res)).toStrictEqual([
      "a",
      "c-pre",
      "d",
      "e",
      "c-post",
      "b",
    ]);
  });

  it("catches sync middleware errors", async () => {
    /** @type {Error} */
    let error = new Error("Init");
    const app = new Application()
      .use(echo)
      .use(function throws() {
        throw new Error("Boom");
      })
      .on("error", (err) => {
        error = err;
      });
    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(messages(res)).toStrictEqual(["Echo: 'foo'"]);
    expect(error?.message).toBe("Boom");
  });

  it("catches async middleware errors", async () => {
    async function throwsAsync() {
      throw new Error("Boom Async");
    }
    const app = new Application().use(echo).use(function throws({ res }) {
      throwsAsync().catch((e) => res.write(e.message));
      res.write("First");
    });
    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(messages(res)).toStrictEqual(["Echo: 'foo'", "First", "Boom Async"]);
  });

  it("exposes errors if demanded", async () => {
    const app = new Application()
      .use(echo)
      .use(function throws() {
        throw new Error("Bang");
      })
      .use(function throws() {
        throw new XError("Boom", { expose: true });
      })
      .on("error", (err, { res }) => {
        if (err.expose) {
          res.write(err.message);
        }
      });

    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(messages(res)).toStrictEqual(["Echo: 'foo'", "Boom"]);
  });

  it("warns about unnamed middleware", async () => {
    const out = new StringWritable();
    const log = getLogger({ name: "root", level: "warn" });
    log.out = out;
    log.timestamps = false;

    new Application({ log })
      // unnamed middleware
      .use(() => {});
    expect(out.data.startsWith("WARN (root):")).toBeTruthy();
  });

  it("logs middleware output", async () => {
    const out = new StringWritable();
    const log = getLogger({ level: "warn" });
    log.out = out;
    log.timestamps = false;

    const app = new Application({ log }) //
      .use(function logs({ log }) {
        log.level = "debug";
        log.debug("Hello");
      });

    const res = new Response();
    await app.dispatch(req("foo"), res);
    expect(out.data).toBe("DEBUG (logs): Hello\n");
  });
});
