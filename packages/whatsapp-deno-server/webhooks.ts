/** Copyright (c) Christian Fuss */

import { HttpError } from "./errors.ts";
import { getLogger } from "./logger.ts";
import { CRYPTO } from "./runtime.ts";
import {
  getMessages,
  getStatuses,
  IncomingMessage,
  MessageListener,
  Notification,
  NotificationListener,
  Status,
  StatusListener,
  WebhooksConfig,
} from "./webhooks.types.ts";

const log = getLogger("Webhooks");

/**
 * Webhooks are triggered when a customer performs an action or the status for
 * a message a business sent changes.
 *
 * For details see
 * https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
 */
export class Webhooks {
  private readonly secret?: string;
  private readonly verifyToken?: string;
  #notificationListeners: NotificationListener[] = [];
  #messageListeners: MessageListener[] = [];
  #statusListeners: StatusListener[] = [];

  /**
   * @param config Configuration for the webhook
   *    missing values will be read from environment variables
   */
  constructor(config: Readonly<WebhooksConfig>) {
    this.secret = config.secret;
    this.verifyToken = config.verifyToken;

    if (!config.isDevelopment) {
      if (!this.secret) {
        throw new Error(`Webhook is not configured for production.
Set WHATSAPP_WEBHOOKS_SECRET to validate the X-Hub-Signature-256 header.`);
      }
      if (!this.verifyToken) {
        throw new Error(`Webhook is not configured for production.
Set WHATSAPP_WEBHOOKS_VERIFY_TOKEN to verify the webhook registration.`);
      }
    }
  }

  set notificationListener(listener: NotificationListener) {
    this.#notificationListeners.push(listener);
  }

  onNotification(listener: NotificationListener) {
    this.#notificationListeners.push(listener);
    return this;
  }

  set messageListener(listener: MessageListener) {
    this.#messageListeners.push(listener);
  }

  onMessage(listener: MessageListener) {
    this.#messageListeners.push(listener);
    return this;
  }

  set statusListener(listener: StatusListener) {
    this.#statusListeners.push(listener);
  }

  onStatus(listener: StatusListener) {
    this.#statusListeners.push(listener);
    return this;
  }

  async handle(request: Request): Promise<Response> {
    try {
      if (request.method === "GET") {
        const { searchParams: params } = new URL(request.url);
        const hubMode = params.get("hub.mode");
        const hubChallenge = params.get("hub.challenge");
        const hubVerifyToken = params.get("hub.verify_token");
        const result = this.verify({ hubMode, hubChallenge, hubVerifyToken });
        return new Response(result, { status: 200 });
      } else if (request.method === "POST") {
        const xHubSignature = request.headers.get("X-Hub-Signature-256");
        const body = await request.text();
        await this.receive(body, xHubSignature);
        return new Response("OK", { status: 200 });
      }
      return new Response("Unhandled request", { status: 401 });
    } catch (error) {
      if (error instanceof HttpError) {
        // We assume that HttpErrors are thrown intentionally and log them
        log.info(
          "Invalid webhook request:",
          `[${error.status}] ${error.message} ${error.description}`,
        );
        return new Response(error.message, { status: error.status });
      }
      throw error;
    }
  }

  verify(
    { hubMode, hubChallenge, hubVerifyToken }: {
      hubMode: string | undefined | null;
      hubChallenge: string | undefined | null;
      hubVerifyToken: string | undefined | null;
    },
  ): string {
    if (
      hubMode === "subscribe" &&
      (!this.verifyToken || hubVerifyToken === this.verifyToken)
    ) {
      return hubChallenge || "";
    }
    throw new HttpError(
      401,
      "Verification failed",
      JSON.stringify({
        hubMode,
        hubChallenge,
        hubVerifyToken,
        expected: this.verifyToken,
      }),
    );
  }

  async receive(body: string, xHubSignature?: string | null) {
    if (!this.warnAboutMissingListeners()) {
      const notification = this.getValidatedNotification(
        body,
        xHubSignature,
      );
      await this.handleNotification(notification);
      for (const message of getMessages(notification)) {
        await this.handleMessage(message);
      }
      for (const status of getStatuses(notification)) {
        await this.handleStatus(status);
      }
    }
  }

  private warnAboutMissingListeners() {
    if (
      this.#notificationListeners.length === 0 &&
      this.#messageListeners.length === 0 &&
      this.#statusListeners.length === 0
    ) {
      log.warn(
        `No listeners registered for webhook.
Use onNotification(), onMessage() or onStatus() to register listeners.`,
      );
      return true;
    }
    return false;
  }

  getValidatedNotification(body: string, xHubSignature?: string | null) {
    if (!this.secret) {
      return JSON.parse(body) as Notification;
    }
    if (!xHubSignature) {
      throw new HttpError(401, "Missing X-Hub-Signature-256 header.");
    }
    const expected = CRYPTO.signSha256(body, this.secret);
    if (xHubSignature.slice("sha256=".length) !== expected) {
      throw new HttpError(
        401,
        `Invalid X-Hub-Signature-256 header: '${xHubSignature}'.`,
        `Expected '${expected}'`,
      );
    }
    return JSON.parse(body) as Notification;
  }

  private async handleNotification(notification: Notification) {
    if (this.#notificationListeners.length === 0) return;
    for (const listener of this.#notificationListeners) {
      try {
        await listener(notification);
      } catch (error) {
        log.error("Uncaught error in notification listeners:", error);
      }
    }
  }

  private async handleMessage(message: IncomingMessage) {
    if (this.#messageListeners.length === 0) return;
    for (const listener of this.#messageListeners) {
      try {
        await listener(message);
      } catch (error) {
        log.error("Uncaught error in message listeners:", error);
      }
    }
  }

  private async handleStatus(status: Status) {
    if (this.#statusListeners.length === 0) return;
    for (const listener of this.#statusListeners) {
      try {
        await listener(status);
      } catch (error) {
        log.error("Uncaught error in status listeners:", error);
      }
    }
  }
}
