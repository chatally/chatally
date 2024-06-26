import { GraphApi } from "./graph-api.js";
import { Messages } from "./messages.js";
import { Webhooks } from "./webhooks.js";

class Webhooks_ extends Webhooks {
  /** @param {any} [config] */
  constructor(config) {
    super(config);
  }
}

const webhooks = new Webhooks_();

class Messages_ extends Messages {
  /**
   * All logged requests
   * @type {Array<{url: string|URL|Request, request: any|undefined}>}
   */
  requests = [];
  constructor() {
    super({
      graphApi: new GraphApi({
        phoneNumberId: "ID",
        accessToken: "ACCESS_TOKEN",
        _request: async (url, request) => {
          this.requests.push({ url, request });
          return {
            statusCode: 200,
            headers: {
              "content-type": "application/json",
            },
            body: {
              json: () => {
                return {
                  messages: [{ id: `wamid-${this.requests.length}` }],
                };
              },
              text: () => {
                throw new Error("Not implemented");
              },
              arrayBuffer: () => {
                throw new Error("Not implemented");
              },
            },
          };
        },
      }),
    });
  }

  /** @param {string} to */
  countWaiting(to) {
    return (this._waiting[to] || []).length;
  }
}

/**
 * @param {number} count
 * @returns {import("./messages.d.ts").Message[]}
 */
function text(count) {
  /** @type {import("./messages.d.ts").TextMessage[]} */
  const messages = [];
  for (let i = 0; i < count; i++) {
    messages.push({
      type: "text",
      text: { body: `Hello, #${i}` },
    });
  }
  return messages;
}

describe("messages", function () {
  describe("unqueued", function () {
    it("uses the correct URL and returns new WAMID", async function () {
      const messages = new Messages_();
      const wamid = await messages.send("foo", text(1)[0]);
      expect(wamid).toEqual("wamid-1");
      expect(messages.requests[0].url).toEqual(
        "https://graph.facebook.com/v20.0/ID/messages/"
      );
    });
  });
  describe("queued", function () {
    it("sends only first message", async function () {
      const messages = new Messages_();
      messages.waitForDelivered(webhooks);
      const texts = text(2);
      const firstId = await messages.send("foo", texts[0]);
      const secondId = await messages.send("foo", texts[1]);
      expect(firstId).toEqual("wamid-1");
      expect(texts[0].id).toEqual("wamid-1");
      expect(messages.requests.length).toEqual(1);
      expect(messages.countWaiting("foo")).toEqual(2);
      expect(secondId).toEqual("<waiting>");
    });
    it("sends second message on webhook notification", async function () {
      const messages = new Messages_();
      const to = "foo";
      messages.waitForDelivered(webhooks);
      const texts = text(3);
      await messages.send(to, texts[0]);
      await messages.send(to, texts[1]);
      await messages.send(to, texts[2]);
      webhooks.emit("notification", {
        messages: [],
        errors: [],
        statuses: [
          {
            recipient_id: to,
            id: texts[0].id || "",
            status: "delivered",
            pricing: {
              billable: false,
              category: "customer_initiated",
              pricing_model: "CBP",
            },
            timestamp: String(Date.now()),
            conversation: {
              origin: { type: "customer_initiated" },
              id: "",
              expiration_timestamp: String(Date.now() + 24 * 60 * 60 * 1000),
            },
          },
        ],
      });
      // emitted events are handled in background, so we forcefully need to
      // wait one tick
      await new Promise((res) => process.nextTick(res));
      expect(texts[1].id).toEqual("wamid-2");
      expect(messages.requests.length).toEqual(2);
      expect(messages.countWaiting(to)).toEqual(2);
      expect(texts[2].id).toEqual("<waiting>");
    });
  });
});
