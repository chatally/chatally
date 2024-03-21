import { GraphApi } from "../graph_api.ts";
import { getLogger } from "../logger.ts";
import { Webhooks } from "../webhooks.ts";
import { Status } from "../webhooks.types.ts";
import { Messages } from "./messages.ts";
import { Message } from "./types.ts";

const log = getLogger("QueuedMessages");

export class QueuedMessages extends Messages {
  #queuedMessages: Map<string, Message[]> = new Map();
  #lastMessageId: Map<string, string> = new Map();

  constructor(
    graphApi: Pick<GraphApi, "request">,
    webhooks: Pick<Webhooks, "onStatus">,
  ) {
    super(graphApi);
    webhooks.onStatus(this.#onStatus.bind(this));
  }

  /**
   * Send a set of messages to a recipient.
   *
   * The messages are sent one after the other, waiting for the previous
   * message to be delivered before sending the next one.
   *
   * @param to recipient phone number
   * @param messages array of messages to send
   */
  async sendAll(to: string, ...messages: Message[]) {
    if (!messages || messages.length === 0) return;

    const queue = this.#queuedMessages.get(to);
    if (queue) {
      // Add messages to queue
      queue.push(...messages);
    } else {
      // Create new queue and send first message immediately
      const [first, ...rest] = messages;
      if (rest.length > 0) {
        this.#queuedMessages.set(to, rest);
      }
      await this.send(to, first);
    }
  }

  async send(to: string, message: Message) {
    const response = await super.send(to, message);
    const id = response.messages[0].id;
    if (id) {
      this.#lastMessageId.set(to, id);
    }
    return response;
  }

  async #onStatus(event: Status) {
    const { recipient_id, id, status } = event;
    if (!["delivered", "read", "failed"].includes(status)) return;

    const lastId = this.#lastMessageId.get(recipient_id);
    if (lastId && id !== lastId) {
      log.warn(
        `Received delivery status for unexpected message,
expected ${lastId}
received ${id}.`,
      );
    }
    this.#lastMessageId.delete(recipient_id);

    const queue = this.#queuedMessages.get(recipient_id);
    if (!queue) return;

    const message = queue.shift();
    if (queue!.length === 0) {
      this.#queuedMessages?.delete(recipient_id);
    }
    if (message) {
      await this.send(recipient_id, message);
    }
  }
}
