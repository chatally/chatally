import {
  Interactive,
  ListSection,
  ReplyButton,
  Row,
} from "../messages/interactive.ts";
import { Audio, Image, Video } from "../messages/media.ts";
import { Message } from "../messages/types.ts";
import { IncomingMessage } from "../webhooks.types.ts";

/**
 * Maps a WhatsApp message to text that is understandable by RASA.
 *
 * - text is mapped to text
 * - reactions are mapped to their emoji
 * - interactive messages are mapped to their id or title
 *   (if no id is available)
 * - buttons are mapped to their payload or title
 *   (if no payload is available)
 * - all other messages are mapped to a `/raw_message` intent
 *   with the message as payload
 *
 * @param input A WhatsApp message
 * @returns text to be interpreted by RASA
 */
export function incomingMessageToText(
  input: IncomingMessage,
): string | undefined {
  switch (input.type) {
    case "text":
      // Replace all words starting with '/' with lowercase
      return input.text.body.replace(/\/\w+/g, (w) => w.toLowerCase());
    case "interactive": {
      const reply = input.interactive.type === "button_reply"
        ? input.interactive.button_reply
        : input.interactive.list_reply;
      return reply.id?.toLowerCase() || reply.title;
    }
    case "button":
      return input.button.payload?.toLowerCase() || input.button.text;
    case "reaction":
      return input.reaction.emoji;
    // Handle other types of messages individually
    // case "audio":
    // case "document":
    // case "image":
    // case "location":
    // case "order":
    // case "referral":
    // case "sticker":
    // case "system":
    // case "video":
    default:
      return `/raw_message${JSON.stringify(input)}`;
  }
}

export function messageToText(message: Message): string {
  switch (message.type) {
    case "text":
      return message.text.body;
    case "interactive":
      return interactiveToText(message.interactive);
    case "image":
      return imageToText(message.image);
    case "audio":
      return audioToText(message.audio);
    case "video":
      return videoToText(message.video);
  }
  return JSON.stringify(message, null, 2);
}

export function interactiveToText(interactive: Interactive): string {
  switch (interactive.type) {
    case "button":
      return `
${interactive.body.text}

${interactive.action.buttons.map(replyButtonToText).join("\n")}
`.trim();
    case "list":
      return `
${interactive.body.text}

${interactive.action.button}
${interactive.action.sections.map(listSectionToText).join("\n")}
`.trim();
  }
  return JSON.stringify(interactive, null, 2);
}

export function replyButtonToText(b: ReplyButton) {
  return `[${b.reply.title}](${b.reply.id})`;
}

export function listSectionToText(s: ListSection) {
  return `
${s.title}:
${s.rows.map(rowToText).join("\n")}
`.trim();
}

export function rowToText(r: Row) {
  return `[${r.title}](${r.id})`;
}

export function imageToText(image: Image): string {
  return `
image: ${image.id || image.link}
${image.caption}
`.trim();
}

export function videoToText(video: Video): string {
  return `
video: ${video.id || video.link}
${video.caption}
`.trim();
}

export function audioToText(audio: Audio): string {
  return `audio: ${audio.id || audio.link}`;
}
