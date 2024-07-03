/**
 * Map WhatsApp message to a ChatAlly message.
 *
 * Some WhatsApp message types are ignored and will return undefined.
 *
 * @param {import("./webhooks.js").IncomingMessage} wa
 * @returns {import("@chatally/core").IncomingMessage}
 */
export function toChatallyMessage (wa) {
  const message = {
    timestamp: Number(wa.timestamp),
    id: wa.id,
    from: wa.from,
    replyTo: wa.context?.id
  }
  switch (wa.type) {
    case 'audio':
      return { ...message, ...audio(wa) }
    case 'document':
      return { ...message, ...document(wa) }
    case 'image':
      return { ...message, ...image(wa) }
    case 'interactive':
      return { ...message, ...interactive(wa) }
    case 'location':
      return { ...message, ...location(wa) }
    case 'reaction':
      return { ...message, ...reaction(wa) }
    case 'sticker':
      return { ...message, ...sticker(wa) }
    case 'text':
      return { ...message, ...text(wa) }
    case 'video':
      return { ...message, ...video(wa) }
    case 'system':
    case 'button':
    case 'order':
    case 'referral':
      return {
        ...message,
        type: 'custom',
        schema: 'whatsappcloud',
        custom: wa
      }
  }
}

/**
 * @param {import("./webhooks.js").IncomingText} wa
 * @returns {import("@chatally/core").Text}
 */
function text (wa) {
  return {
    type: 'text',
    text: wa.text.body
  }
}

/**
 * @param {import("./webhooks.js").IncomingImage} wa
 * @returns {import("@chatally/core").Image}
 */
function image (wa) {
  return {
    type: 'image',
    image: {
      url: download(wa.image.id),
      mimeType: wa.image.mime_type,
      caption: wa.image.caption
    }
  }
}

/**
 * Create a download URL for WhatsAppCloud media assets.
 *
 * @param {string} id
 */
function download (id) {
  return `whatsappcloud://download/${id}`
}

/**
 * @param {import("./webhooks.js").IncomingAudio} wa
 * @returns {import("@chatally/core").Audio}
 */
function audio (wa) {
  return {
    type: 'audio',
    audio: {
      url: download(wa.audio.id),
      mimeType: wa.audio.mime_type
    }
  }
}

/**
 * @param {import("./webhooks.js").IncomingVideo} wa
 * @returns {import("@chatally/core").Video}
 */
function video (wa) {
  return {
    type: 'video',
    video: {
      url: download(wa.video.id),
      mimeType: wa.video.mime_type,
      caption: wa.video.caption
    }
  }
}

/**
 * @param {import("./webhooks.js").IncomingDocument} wa
 * @returns {import("@chatally/core").Document}
 */
function document (wa) {
  return {
    type: 'document',
    document: {
      url: download(wa.document.id),
      mimeType: wa.document.mime_type,
      caption: wa.document.caption,
      filename: wa.document.filename
    }
  }
}

/**
 * @param {import("./webhooks.js").IncomingLocation} wa
 * @returns {import("@chatally/core").Location}
 */
function location (wa) {
  return {
    type: 'location',
    location: wa.location
  }
}

/**
 * @param {import("./webhooks.js").IncomingReaction} wa
 * @returns {import("@chatally/core").Reaction}
 */
function reaction (wa) {
  return {
    type: 'reaction',
    reaction: {
      replyTo: wa.reaction.message_id,
      emoji: wa.reaction.emoji
    }
  }
}

/**
 * @param {import("./webhooks.js").IncomingSticker} wa
 * @returns {import("@chatally/core").Image}
 */
function sticker (wa) {
  return {
    type: 'image',
    image: {
      url: download(wa.sticker.id),
      mimeType: wa.sticker.mime_type,
      caption: '<Sticker>'
    }
  }
}

/**
 * @param {import("./webhooks.js").IncomingInteractive} wa
 * @returns {import("@chatally/core").Action}
 */
function interactive (wa) {
  if (wa.interactive.type === 'button_reply') {
    return {
      type: 'action',
      action: wa.interactive.button_reply
    }
  } else {
    return {
      type: 'action',
      action: wa.interactive.list_reply
    }
  }
}
