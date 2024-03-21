import { isoDateTime } from "../logger.ts";
import { isMessage, MessagesResponse } from "../messages/types.ts";
import { FS } from "../runtime.ts";
import { JsonData } from "../types.ts";
import { getTimestamp } from "../utils/time.ts";
import { incomingMessageToText, messageToText } from "../utils/toText.ts";
import {
  getValues,
  IncomingMessage,
  Notification,
  Status,
} from "../webhooks.types.ts";

export class LogApi {
  readonly #store: LogStore;

  constructor(logDir: string) {
    this.#store = new LogStore(logDir);
  }

  /**
   * Log notifications.
   *
   * @param notification Notification to log
   * @returns Promise that resolves when the notification has been logged
   */
  notification(notification: Notification): void | Promise<void> {
    for (const value of getValues(notification)) {
      if (value.messages) {
        this.#store.incoming(...value.messages);
      }
      if (value.statuses) {
        this.#store.status(...value.statuses);
      }
    }
  }

  sent(body: JsonData, response: MessagesResponse): void | Promise<void> {
    this.#store.outgoing(body, response);
  }

  error(
    body: JsonData,
    error: Error,
  ): Promise<MessagesResponse> {
    this.#store.error(body, error);
    throw error;
  }
}

interface LogEntry {
  type: "in" | "out" | "status" | "error";
  from: string;
  id: string;
  timestamp: string | number;
  text: string;
}

class LogStore {
  readonly #logDir: string;
  readonly #entries: LogEntry[] = [];
  #cloning = false;
  #flushing = false;

  constructor(logDir: string) {
    this.#logDir = logDir;
  }

  async #push(entry: LogEntry) {
    while (this.#cloning) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    this.#entries.push(entry);
    while (this.#flushing) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    if (this.#entries.length > 0) {
      this.#flushing = true;
      this.#cloning = true;
      const toFlush = [...this.#entries];
      this.#entries.length = 0;
      this.#cloning = false;
      await this.#flush(toFlush);
      this.#flushing = false;
    }
  }

  async #flush(entries: LogEntry[]) {
    await FS.ensureDir(this.#logDir);
    // generate filename with current date in logDir
    const filename = `${this.#logDir}/log-${isoDateTime().slice(0, 10)}.csv`;
    const lines: string[] = [];
    // if the file does not exist, add the header
    if (!await FS.exists(filename)) {
      lines.push("type,from,id,timestamp,text");
    }
    // add the entries
    for (const entry of entries) {
      const { type, from, id, timestamp } = entry;
      const text = entry.text.replace(/"/g, '\\"');
      lines.push(`${type},+${from},${id},${timestamp},"${text}"`);
    }
    await FS.writeText(filename, lines.join("\n") + "\n", { append: true });
  }

  incoming(...messages: IncomingMessage[]) {
    for (const message of messages) {
      const { from, id, timestamp } = message;
      const text = incomingMessageToText(message) || "";
      this.#push({ type: "in", from, id, timestamp, text });
    }
  }

  outgoing(body: JsonData, response: MessagesResponse) {
    const from = body.to as string;
    const id = response.messages[0]?.id;
    const timestamp = getTimestamp();
    const text = isMessage(body)
      ? messageToText(body)
      : JSON.stringify(body, null, 2);

    this.#push({ type: "out", from, id, timestamp, text });
  }

  status(...statuses: Status[]) {
    for (const status of statuses) {
      const { id, status: text, recipient_id: from, timestamp } = status;
      this.#push({ type: "status", from, id, timestamp, text });
    }
  }

  error(body: JsonData, error: Error) {
    const from = body.to as string;
    const id = "";
    const timestamp = getTimestamp();
    this.#push({
      type: "error",
      from,
      id,
      timestamp,
      text: `${error.message}

${JSON.stringify(body, null, 2)}`,
    });
  }
}
