import { JsonData } from "../types.ts";
import { ContactsMessage } from "./contacts.ts";
import { InteractiveMessage } from "./interactive.ts";
import { LocationMessage } from "./location.ts";
import {
  AudioMessage,
  DocumentMessage,
  ImageMessage,
  StickerMessage,
  VideoMessage,
} from "./media.ts";
import { ReactionMessage } from "./reaction.ts";
import { TemplateMessage } from "./template.ts";
import { TextMessage } from "./text.ts";

export type Message =
  | AudioMessage
  | ContactsMessage
  | DocumentMessage
  | ImageMessage
  | InteractiveMessage
  | LocationMessage
  | ReactionMessage
  | StickerMessage
  | TemplateMessage
  | TextMessage
  | VideoMessage;

export function isMessage(message: unknown): message is Message {
  return (
    message !== null &&
    typeof message === "object" &&
    typeof (message as Message).type === "string" &&
    Object.keys(message).includes((message as Message).type)
  );
}

/**
 * Response from the Graph API when sending a message.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#successful-response
 */
export type MessagesResponse = {
  messaging_product: "whatsapp";
  contacts?: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
};

/**
 * Listener to get informed when a message was sent.
 */
export type MessagesSentListener = (
  body: JsonData,
  response: MessagesResponse,
) => void | Promise<void>;

export type MessagesErrorHandler = (
  body: JsonData,
  error: Error,
) => MessagesResponse | Promise<MessagesResponse>;
