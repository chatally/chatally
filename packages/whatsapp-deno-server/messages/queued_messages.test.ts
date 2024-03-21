import { delay } from "https://deno.land/std@0.188.0/async/delay.ts";
import { assertEquals } from "https://deno.land/std@0.188.0/testing/asserts.ts";
import { GraphApi } from "../graph_api.ts";
import { GraphApiRequest } from "../graph_api.types.ts";
import { Webhooks } from "../webhooks.ts";
import { Status, StatusListener } from "../webhooks.types.ts";
import { QueuedMessages } from "./queued_messages.ts";
import { Message } from "./types.ts";

const metadata: Omit<Status, "id" | "status"> = {
  timestamp: "<now>",
  recipient_id: "<test_user>",
  conversation: {
    id: "<conversation_id>",
    expiration_timestamp: "<in 24 hours>",
    origin: {
      type: "user_initiated",
    },
  },
  pricing: {
    billable: true,
    pricing_model: "CBP",
    category: "user_initiated",
  },
};

const DELAY = 100;

class Mock implements Pick<GraphApi, "request">, Pick<Webhooks, "onStatus"> {
  #counter = 0;
  #log: string[] = [];
  #listener?: StatusListener;

  constructor() {}

  request<R>(_: GraphApiRequest) {
    const id = `Message-${this.#counter++}`;
    this.#log.push(`Sent: ${id}`);
    this.#queueStatus(id);
    return {
      messaging_product: "whatsapp",
      messages: [{ id }],
    } as R;
  }

  #queueStatus(id: string) {
    setTimeout(() => {
      const status = "read";
      this.#log.push(`Status: ${JSON.stringify({ id, status })}`);
      this.#listener?.({
        id,
        status,
        ...metadata,
      });
    }, DELAY);
  }

  onStatus(listener?: StatusListener): Webhooks {
    this.#listener = listener;
    return this as unknown as Webhooks;
  }

  get log(): string[] {
    return this.#log;
  }
}

const mock = new Mock();

const api = new QueuedMessages(mock, mock);

Deno.test("Two messages", async function () {
  const input: Message[] = [
    { type: "text", text: { body: "Hello" } },
    { type: "text", text: { body: "World" } },
  ];
  const expected: string[] = [
    "Sent: Message-0",
    'Status: {"id":"Message-0","status":"read"}',
    "Sent: Message-1",
    'Status: {"id":"Message-1","status":"read"}',
  ];

  await api.sendAll(metadata.recipient_id, ...input);
  await delay(3 * DELAY);
  assertEquals(mock.log, expected);
});
