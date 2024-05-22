/**
 * Map WhatsApp message to a ChatAlly message.
 *
 * Some WhatsApp message types are ignored and will return undefined.
 *
 * @param {import("./webhooks-types.js").IncomingMessage} wa
 * @returns {import("@chatally/core").IncomingMessage}
 */
export function toChatallyMessage(wa) {
  /** @type {import("@chatally/core").Message | undefined} */
  let mapped = undefined;
  switch (wa.type) {
    case "audio":
      mapped = audio(wa);
      break;
    case "document":
      mapped = document(wa);
      break;
    case "image":
      mapped = image(wa);
      break;
    case "interactive":
      mapped = interactive(wa);
      break;
    case "location":
      mapped = location(wa);
      break;
    case "reaction":
      mapped = reaction(wa);
      break;
    case "sticker":
      mapped = sticker(wa);
      break;
    case "text":
      mapped = text(wa);
      break;
    case "video":
      mapped = video(wa);
      break;
    case "system":
    case "button":
    case "order":
    case "referral":
      mapped = {
        type: "custom",
        schema: "whatsappcloud",
        custom: wa,
      };
      break;
  }
  return {
    timestamp: Number(wa.timestamp),
    id: wa.id,
    from: wa.from,
    replyTo: wa.context?.id,
    ...mapped,
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingText} wa
 * @returns {import("@chatally/core").Text}
 */
function text(wa) {
  return {
    type: "text",
    text: wa.text.body,
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingImage} wa
 * @returns {import("@chatally/core").Image}
 */
function image(wa) {
  return {
    type: "image",
    image: {
      url: download(wa.image.id),
      mimeType: wa.image.mime_type,
      caption: wa.image.caption,
    },
  };
}

/**
 * Create a download URL for WhatsAppCloud media assets.
 *
 * @param {string} id
 */
function download(id) {
  return `whatsappcloud://download/${id}`;
}

/**
 * @param {import("./webhooks-types.js").IncomingAudio} wa
 * @returns {import("@chatally/core").Audio}
 */
function audio(wa) {
  return {
    type: "audio",
    audio: {
      url: download(wa.audio.id),
      mimeType: wa.audio.mime_type,
    },
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingVideo} wa
 * @returns {import("@chatally/core").Video}
 */
function video(wa) {
  return {
    type: "video",
    video: {
      url: download(wa.video.id),
      mimeType: wa.video.mime_type,
      caption: wa.video.caption,
    },
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingDocument} wa
 * @returns {import("@chatally/core").Document}
 */
function document(wa) {
  return {
    type: "document",
    document: {
      url: download(wa.document.id),
      mimeType: wa.document.mime_type,
      caption: wa.document.caption,
      filename: wa.document.filename,
    },
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingLocation} wa
 * @returns {import("@chatally/core").Location}
 */
function location(wa) {
  return {
    type: "location",
    location: wa.location,
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingReaction} wa
 * @returns {import("@chatally/core").Reaction}
 */
function reaction(wa) {
  return {
    type: "reaction",
    reaction: {
      replyTo: wa.reaction.message_id,
      emoji: wa.reaction.emoji,
    },
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingSticker} wa
 * @returns {import("@chatally/core").Image}
 */
function sticker(wa) {
  return {
    type: "image",
    image: {
      url: download(wa.sticker.id),
      mimeType: wa.sticker.mime_type,
      caption: "<Sticker>",
    },
  };
}

/**
 * @param {import("./webhooks-types.js").IncomingInteractive} wa
 * @returns {import("@chatally/core").Select}
 */
function interactive(wa) {
  if (wa.interactive.type === "button_reply") {
    return {
      type: "select",
      select: wa.interactive.button_reply,
    };
  } else {
    return {
      type: "select",
      select: wa.interactive.list_reply,
    };
  }
}
