import supertest from "supertest";
import { Webhooks } from "./webhooks.js";

class _Webhooks extends Webhooks {
  /** @param {import("./webhooks.d.ts").WebhooksConfig} [config] */
  constructor(config) {
    super(config);
    this.app = supertest(this._app);
  }
}

/**
 * @param {string} from
 * @param {string} text
 */
function text(from, text) {
  return {
    entry: [
      {
        message: { from, text },
      },
    ],
  };
}

describe("webhooks", function () {
  describe("register", function () {
    it("accepts with no verifyToken configured", async function () {
      const webhooks = new _Webhooks();
      const res = await webhooks.app.get(
        "/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123"
      );
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("123");
    });
    it("accepts with correct verifyToken", async function () {
      const webhooks = new _Webhooks({ verifyToken: "abc" });
      const res = await webhooks.app.get(
        "/?hub.mode=subscribe&hub.verify_token=abc&hub.challenge=123"
      );
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("123");
    });
    it("fails with incorrect verifyToken", async function () {
      const webhooks = new _Webhooks({ verifyToken: "abc" });
      const res = await webhooks.app.get(
        "/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123"
      );
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Verification failed");
    });
    it("fails for arbitrary requests", async function () {
      const webhooks = new _Webhooks({ verifyToken: "abc" });
      const res = await webhooks.app.get("/");
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Verification failed");
    });
    it("fails for arbitrary requests, also with no verifyToken configured", async function () {
      const webhooks = new _Webhooks();
      const res = await webhooks.app.get("/");
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Verification failed");
    });
  });
  describe("verifySignature", function () {
    it("accepts without secret", async function () {
      const webhooks = new _Webhooks();
      const res = await webhooks.app.post("/").send(text("me", "foo"));
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("OK");
    });
    it("accepts with correct signature", async function () {
      const webhooks = new _Webhooks({ secret: "abc" });
      const res = await webhooks.app
        .post("/")
        .set(
          "x-hub-signature-256",
          "14628c8cd96535a55d0be7b1f18b73d4ce2f5f9e1007a0272fef421700dac174"
        )
        .send(text("me", "foo"));
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("OK");
    });
    it("fails without body (Bad Request)", async function () {
      const webhooks = new _Webhooks();
      const res = await webhooks.app.post("/");
      expect(res.status).toEqual(400);
      expect(res.text).toEqual("No data received");
    });
    it("fails for unsigned content (Bad Request)", async function () {
      const webhooks = new _Webhooks({ secret: "abc" });
      const res = await webhooks.app.post("/").send(text("me", "foo"));
      expect(res.status).toEqual(400);
      expect(res.text).toEqual("Missing header 'x-hub-signature-256'.");
    });
    it("fails for incorrect signature (Bad Request)", async function () {
      const webhooks = new _Webhooks({ secret: "abc" });
      const res = await webhooks.app
        .post("/")
        .set("x-hub-signature-256", "foo")
        .send(text("me", "foo"));
      expect(res.status).toEqual(400);
      expect(res.text).toEqual("Invalid 'x-hub-signature-256'.");
    });
  });
});
