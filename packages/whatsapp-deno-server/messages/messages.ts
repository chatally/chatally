/** Copyright (c) Christian Fuss */
import { getLogger } from "../logger.ts";
import { GraphApi } from "../graph_api.ts";
import { JsonData } from "../types.ts";
import { Contact } from "./contacts.ts";
import { Interactive } from "./interactive.ts";
import { Location } from "./location.ts";
import { Audio, Document, Image, Sticker, Video } from "./media.ts";
import { Template } from "./template.ts";
import { Text } from "./text.ts";
import {
  Message,
  MessagesErrorHandler,
  MessagesResponse,
  MessagesSentListener,
} from "./types.ts";

const log = getLogger("Messages");

/**
 * Send WhatsApp messages using the Graph API. Abstracts the
 * `https://graph.facebook.com/<version>/PHONE_NUMBER_ID/messages` endpoint.
 *
 * Use it to send text, media, contacts, location, and interactive messages, as
 * well as message templates through WhatsApp. You can also mark incoming
 * messages as `read` through the Messages endpoint.
 *
 * [Learn more about the messages you can send](https://developers.facebook.com/docs/whatsapp/conversation-types).
 *
 * Messages are sent asynchronously. The API returns a 200 OK response with the
 * message's unique ID (WAMID) when the message is successfully queued for
 * delivery. The API does not return a response when the message is delivered.
 * There is no guarantee about the order of delivery, even when awaiting the
 * method call.
 *
 * You can await the Promise returned by the respective send method and use it
 * with Webhooks to track the delivery status of the message. There is the
 * {@link QueuedMessages} abstraction, that allows you to send messages in a
 * given sequence.
 */
export class Messages {
  readonly #onSent: MessagesSentListener[] = [];
  #onError?: MessagesErrorHandler;

  constructor(private readonly graphApi: Pick<GraphApi, "request">) { }

  /**
   * @param listener that gets informed when a message was sent.
   * @returns this, for chaining
   */
  onSent(listener: MessagesSentListener) {
    this.#onSent.push(listener);
    return this;
  }

  /**
   * @param handler that can handle errors and can return a response
   * @returns this, for chaining
   */
  onError(handler: MessagesErrorHandler) {
    this.#onError = handler;
    return this;
  }

  /**
   * Wrapper around the Graph API request to send a message.
   *
   * It automatically sets the `messaging_product` and `recipient_type` fields,
   * as well as the correct headers. For full type-safety use the respective
   * send<Type> methods instead.
   *
   * @param to recipient phone number
   * @param type message type
   * @param payload payload corresponding to the message type
   * @param message_id optional message id to reply to
   * @returns the response from the WhatsApp server, including the message id
   *          (WAMID) of the sent message
   */
  async send(to: string, message: Message, message_id?: string) {
    const body: JsonData = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      // deno-lint-ignore no-explicit-any
      ...(message as any),
    };
    if (message_id) {
      body.context = { message_id };
    }

    try {
      const response = await this.graphApi.request<MessagesResponse>({
        method: "POST",
        endpoint: "messages",
        body,
      });
      for (const listener of this.#onSent) {
        try {
          await listener(body, response);
        } catch (error) {
          log.error(error);
        }
      }
      if (!response.messages || response.messages.length === 0) {
        throw new Error(
          `Message was not sent: ${JSON.stringify(response, null, 2)}`,
        );
      }
      return response;
    } catch (error) {
      if (this.#onError) {
        return await this.#onError(body, error);
      } else {
        throw error;
      }
    }
  }

  async sendAudio(to: string, audio: Audio, replyId?: string) {
    return await this.send(to, { type: "audio", audio }, replyId);
  }

  async sendContacts(to: string, data: Contact | Contact[], replyId?: string) {
    const contacts = Array.isArray(data) ? data : [data];
    return await this.send(to, { type: "contacts", contacts }, replyId);
  }

  async sendDocument(to: string, document: Document, replyId?: string) {
    return await this.send(to, { type: "document", document }, replyId);
  }

  async sendImage(to: string, image: Image, replyId?: string) {
    return await this.send(to, { type: "image", image }, replyId);
  }

  async sendInteractive(
    to: string,
    interactive: Interactive,
    replyId?: string,
  ) {
    return await this.send(to, { type: "interactive", interactive }, replyId);
  }

  async sendLocation(to: string, location: Location, replyId?: string) {
    return await this.send(to, { type: "location", location }, replyId);
  }

  async sendReaction(to: string, emoji: string, message_id: string) {
    return await this.send(to, {
      type: "reaction",
      reaction: { emoji, message_id },
    });
  }

  async sendSticker(to: string, sticker: Sticker, replyId?: string) {
    return await this.send(to, { type: "sticker", sticker }, replyId);
  }

  async sendTemplate(to: string, template: Template, replyId?: string) {
    return await this.send(to, { type: "template", template }, replyId);
  }

  async sendText(to: string, text: Text | string, replyId?: string) {
    if (typeof text === "string") {
      text = { body: text };
    }
    if (text.preview_url !== false) {
      text.preview_url = true;
    }
    return await this.send(to, { type: "text", text }, replyId);
  }

  async sendVideo(to: string, video: Video, replyId?: string) {
    return await this.send(to, { type: "video", video }, replyId);
  }

  /**
   * Mark a message as read.
   *
   * Send a POST request to the `/PHONE_NUMBER_ID/messages` endpoint with
   * messaging_product set to whatsapp, message_id set to the message ID and
   * status to read.
   *
   * For details, see https://developers.facebook.com/docs/whatsapp/cloud-api/guides/mark-message-as-read
   *
   * @param message_id The WAMID of the message to mark as read.
   * @returns true if the message was marked as read, false otherwise.
   */
  async markAsRead(message_id: string) {
    const body: JsonData = {
      messaging_product: "whatsapp",
      status: "read",
      message_id,
    };

    const { success } = await this.graphApi.request<{ success: boolean }>({
      method: "POST",
      endpoint: "messages",
      body,
    });
    return success;
  }
}
