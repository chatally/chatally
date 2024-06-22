import supertest from "supertest";
import { Webhooks } from "./webhooks.js";

class Webhooks_ extends Webhooks {
  /** @param {import("./index.d.ts").WebhooksConfig} [config] */
  constructor(config) {
    super(config);
    this.test = supertest(this._server);
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
  describe("GET (register)", function () {
    it("returns OK for arbitrary requests", async function () {
      const webhooks = new Webhooks_({ verifyToken: "abc" });
      const res = await webhooks.test.get("/");
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("OK");
    });
    it("passes without verifyToken", async function () {
      const webhooks = new Webhooks_();
      const res = await webhooks.test.get(
        "/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123"
      );
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("123");
    });
    it("passes with correct verifyToken", async function () {
      const webhooks = new Webhooks_({ verifyToken: "abc" });
      const res = await webhooks.test.get(
        "/?hub.mode=subscribe&hub.verify_token=abc&hub.challenge=123"
      );
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("123");
    });
    it("fails with incorrect verifyToken", async function () {
      const webhooks = new Webhooks_({ verifyToken: "abc" });
      const res = await webhooks.test.get(
        "/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123"
      );
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Verification failed");
    });
  });
  describe("Valid POST (incoming)", function () {
    it("responds OK without secret", async function () {
      const webhooks = new Webhooks_();
      const res = await webhooks.test.post("/").send(text("me", "foo"));
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("OK");
    });
    it("responds OK with correct signature", async function () {
      const webhooks = new Webhooks_({ secret: "abc" });
      const res = await webhooks.test
        .post("/")
        .set(
          "x-hub-signature-256",
          "14628c8cd96535a55d0be7b1f18b73d4ce2f5f9e1007a0272fef421700dac174"
        )
        .send(text("me", "foo"));
      expect(res.status).toEqual(200);
      expect(res.text).toEqual("OK");
    });
  });
  describe("Invalid POST (incoming)", function () {
    it("without body", async function () {
      const webhooks = new Webhooks_();
      const res = await webhooks.test.post("/");
      expect(res.status).toEqual(400);
      expect(res.text).toEqual("No data received");
    });
    it("unsigned content", async function () {
      const webhooks = new Webhooks_({ secret: "abc" });
      const res = await webhooks.test.post("/").send(text("me", "foo"));
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Missing header 'x-hub-signature-256'.");
    });
    it("incorrect signature", async function () {
      const webhooks = new Webhooks_({ secret: "abc" });
      const res = await webhooks.test
        .post("/")
        .set("x-hub-signature-256", "foo")
        .send(text("me", "foo"));
      expect(res.status).toEqual(401);
      expect(res.text).toEqual("Invalid 'x-hub-signature-256'.");
    });
  });
});
