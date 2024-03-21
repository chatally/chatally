// Copyright (c) Christian Fuss

import { newGraphApiConfig, newWebhooksConfig } from "./config.ts";
import { GraphApi, GraphApiConfig } from "./graph_api.ts";
import { Media } from "./media/media.ts";
import { Messages } from "./messages/messages.ts";
import { QueuedMessages } from "./messages/queued_messages.ts";
import { PhoneNumbers } from "./phone_numbers.ts";
import { TwoStepVerification } from "./two_step_verification.ts";
import { Webhooks } from "./webhooks.ts";
import { WebhooksConfig } from "./webhooks.types.ts";

export interface WhatsAppConfig {
  graphApi?: Partial<GraphApiConfig>;
  webhooks?: Partial<WebhooksConfig>;
}

/**
 * WhatsApp SDK.
 *
 * One instance of the SDK manages one WhatsApp Business Account, i.e. one
 * phone number.
 *
 * It implements the WhatsApp Business Platform API made up of the webhooks API
 * for incoming notifications and the WhatsApp specific layers on top of the
 * Facebook GraphAPI for outgoing communication: Messages, Phone Numbers
 * (registration) and 2-Step-Verification.
 *
 * For details see https://developers.facebook.com/docs/whatsapp
 */
export class WhatsApp {
  #graphApi?: GraphApi;
  #messages?: Messages;
  #media?: Media;
  #phoneNumbers?: PhoneNumbers;
  #twoStepVerification?: TwoStepVerification;
  #webhooks?: Webhooks;

  constructor(
    private readonly config: WhatsAppConfig = {},
    private readonly readEnv = true,
  ) {}

  protected get graphApi(): GraphApi {
    if (!this.#graphApi) {
      const config = newGraphApiConfig(this.config.graphApi, this.readEnv);
      this.#graphApi = new GraphApi(config);
    }
    return this.#graphApi;
  }

  /**
   * Wrapper around the Messages API.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
   */
  get messages(): Messages {
    if (!this.#messages) {
      this.#messages = new Messages(this.graphApi);
    }
    return this.#messages;
  }

  /**
   * Wrapper around the Phone Numbers API.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers
   */
  get media(): Media {
    if (!this.#media) {
      this.#media = new Media(this.graphApi);
    }
    return this.#media;
  }

  /**
   * Wrapper around the Phone Numbers API.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/phone-numbers
   */
  get phoneNumbers(): PhoneNumbers {
    if (!this.#phoneNumbers) {
      this.#phoneNumbers = new PhoneNumbers(this.graphApi);
    }
    return this.#phoneNumbers;
  }

  /**
   * Wrapper around the Two-Step Verification API.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/two-step-verification
   */
  get twoStepVerification(): TwoStepVerification {
    if (!this.#twoStepVerification) {
      this.#twoStepVerification = new TwoStepVerification(this.graphApi);
    }
    return this.#twoStepVerification;
  }

  /**
   * Passive wrapper around the Webhooks API.
   *
   * Use this to implement your own HTTP server.
   *
   * It handles webhook verification protocol as well as payload validation.
   * It unwraps the notification and its messages and passes them to the
   * registered listeners (use onNotification/onMessage to register a listener).
   *
   * For details see
   * https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
   */
  get webhooks(): Webhooks {
    if (!this.#webhooks) {
      const config = newWebhooksConfig(
        this.config.webhooks,
        this.readEnv,
      );
      this.#webhooks = new Webhooks(config);
    }
    return this.#webhooks;
  }
}

export class QueuedWhatsApp extends WhatsApp {
  #messages?: QueuedMessages;

  constructor(
    config: WhatsAppConfig = {},
    readEnv = true,
  ) {
    super(config, readEnv);
  }

  /**
   * Wrapper around the Messages API that supports queued messages.
   *
   * For details see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
   */
  get messages(): QueuedMessages {
    if (!this.#messages) {
      this.#messages = new QueuedMessages(this.graphApi, this.webhooks);
    }
    return this.#messages;
  }
}
