import { DryRunError, HttpError } from "../errors.ts";
import { getLogger, Level } from "../logger.ts";
import { Messages } from "../messages/messages.ts";
import { QueuedMessages } from "../messages/queued_messages.ts";
import { Message } from "../messages/types.ts";
import { ENV } from "../runtime.ts";
import { WA_DATA_DIR } from "../sample/config.ts";
import { Webhooks } from "../webhooks.ts";
import { IncomingMessage } from "../webhooks.types.ts";
import { gdprConsent } from "./gdprConsent.ts";
import { LogApi } from "./logApi.ts";
import { MediaIds } from "./mediaIds.ts";

const log = getLogger("WhatsAppHandler", Level.DEBUG);

interface Context {
  params: Record<string, string>;
  request: Request;
  response: Response;
}

interface Request {
  headers: {
    get(name: string): string | null;
  };
  body(options: { type: "text" }): { value: Promise<string> };
}

interface Response {
  status: number;
  set body(text: string);
  get body(): unknown;
}

export abstract class WhatsAppHandler {
  readonly #verify: typeof Webhooks.prototype.verify;
  readonly #receive: typeof Webhooks.prototype.receive;
  readonly #send: typeof Messages.prototype.send;
  readonly #sendAll: typeof QueuedMessages.prototype.sendAll;
  readonly #mediaIds: MediaIds;

  constructor(webhooks: Webhooks, messages: Messages, mediaIds: MediaIds) {
    const log = new LogApi(`${WA_DATA_DIR}/log`);
    this.#verify = webhooks.verify.bind(webhooks);
    this.#receive = webhooks.receive.bind(webhooks);
    webhooks
      .onNotification(log.notification.bind(log))
      .onMessage(this.handleMessage.bind(this));

    this.#send = messages.send.bind(messages);
    if (messages instanceof QueuedMessages) {
      this.#sendAll = messages.sendAll.bind(messages);
    } else {
      this.#sendAll = async (from, ...messages) => {
        for (const message of messages) {
          await this.#send(from, message);
        }
      };
    }
    messages
      .onSent(log.sent.bind(log))
      .onError(log.error.bind(log));

    this.#mediaIds = mediaIds;
  }

  protected async handleMessage(message: IncomingMessage) {
    try {
      const { from } = message;
      const consent = await gdprConsent(message);
      if (consent !== true) {
        await this.#send(from, consent);
        if (message.type !== "text" || message.text.body !== "/start_session") {
          return;
        }
      }

      const messages = await this.respond(message);
      if (messages && messages.length > 0) {
        for (const message of messages) {
          if (message.type === "image" && message.image.link) {
            await this.#uploadMedia(message.image);
          } else if (message.type === "video" && message.video.link) {
            await this.#uploadMedia(message.video);
          } else if (message.type === "audio" && message.audio.link) {
            await this.#uploadMedia(message.audio);
          }
        }
        await this.#sendAll(from, ...messages);
      }
    } catch (error) {
      if (ENV.isProduction() || !(error instanceof DryRunError)) {
        log.error("Failed to send WhatsApp message:", error);
      }
    }
  }

  protected abstract respond(
    message: IncomingMessage,
  ): Promise<Message[] | undefined>;

  async #uploadMedia(media: { link?: string; id?: string }) {
    if (media.link && !media.link.startsWith("http")) {
      const mediaId = await this.#mediaIds.getMediaId(media.link);
      delete media.link;
      media.id = mediaId;
    }
  }

  get get() {
    return this.getHandler.bind(this);
  }

  protected getHandler(ctx: Context): void | Promise<void> {
    const { response, params } = ctx;
    try {
      response.body = this.#verify({
        hubMode: params["hub.mode"],
        hubChallenge: params["hub.challenge"],
        hubVerifyToken: params["hub.verify_token"],
      });
    } catch (error) {
      if (error instanceof HttpError) {
        response.status = error.status;
        response.body = error.message;
        log.info(error.message, error.description);
      } else {
        throw error;
      }
    }
  }

  get post() {
    return this.postHandler.bind(this);
  }

  protected async postHandler(ctx: Context): Promise<void> {
    const { request, response } = ctx;
    try {
      const signature = request.headers.get("X-Hub-Signature-256");
      const body = await request.body({ type: "text" }).value;
      await this.#receive(body, signature);
      response.body = "OK";
    } catch (error) {
      if (error instanceof HttpError) {
        response.status = error.status;
        response.body = error.message;
        log.info(error.message, error.description);
      } else {
        throw error;
      }
    }
  }
}
