/**
 * @param {import("@chatally/core").OutgoingMessage} message
 * @returns {import("./messages.js").Message}
 */
export function toWhatsAppMessage(message) {
  switch (message.type) {
    case "audio":
      return {
        type: "audio",
        audio: {
          id: upload(message.audio),
        },
      };
    case "buttons":
      // TODO: Chack validity of input, i.e. at most 3 buttons
      return {
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text: message.buttons.text,
          },
          action: {
            buttons: message.buttons.actions.map((a) => ({
              type: "reply",
              reply: a,
            })),
          },
        },
      };
    case "custom":
      return /** @type {import("./messages.js").Message} */ (message.custom);
    case "document":
      return {
        type: "document",
        document: {
          id: upload(message.document),
          caption: message.document.caption,
          filename: message.document.filename,
        },
      };
    case "image":
      if (message.image.mimeType === "image/webp") {
        return {
          type: "sticker",
          sticker: {
            id: upload(message.image),
          },
        };
      } else {
        return {
          type: "image",
          image: {
            id: upload(message.image),
            caption: message.image.caption,
          },
        };
      }
    case "location":
      return {
        type: "location",
        location: message.location,
      };
    case "menu":
      // TODO: Check validity of menu input
      return {
        type: "interactive",
        interactive: {
          type: "list",
          body: {
            text: message.menu.text,
          },
          action: {
            button: message.menu.title,
            sections: message.menu.sections.map((s) => ({
              title: s.title,
              rows: s.actions,
            })),
          },
        },
      };
    case "reaction":
      return {
        type: "reaction",
        reaction: {
          message_id: message.reaction.replyTo,
          emoji: message.reaction.emoji,
        },
      };
    case "text":
      return {
        type: "text",
        text: {
          body: message.text,
        },
      };
    case "video":
      return {
        type: "video",
        video: {
          id: upload(message.video),
          caption: message.video.caption,
        },
      };
  }
}

/**
 *
 * @param {object} m
 * @param {string} m.url
 * @param {string} m.mimeType
 * @returns {string}
 */
function upload({ url, mimeType }) {
  return `whatsappcloud://upload/${url}/?mimeType=${mimeType}`;
}
