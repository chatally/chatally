export const mediaUrlPrefix = 'media://whatsappcloud/'

/**
 * Map WhatsApp message to a ChatAlly message.
 *
 * @param {import('./webhooks.js').IncomingMessage} wa
 * @returns {import('@chatally/core').ChatRequest}
 *    A ChatAlly request
 */
export function toChatally(wa) {
  const message = {
    timestamp: Number(wa.timestamp),
    id: wa.id,
    from: wa.from,
    replyTo: wa.context?.id,
    source: 'whatsappcloud',
  }
  switch (wa.type) {
    case 'audio': return { ...message, ...audio(wa) }
    case 'document': return { ...message, ...document(wa) }
    case 'image': return { ...message, ...image(wa) }
    case 'interactive': return { ...message, ...interactive(wa) }
    case 'location': return { ...message, ...location(wa) }
    case 'reaction': return { ...message, ...reaction(wa) }
    case 'sticker': return { ...message, ...sticker(wa) }
    case 'text': return { ...message, ...text(wa) }
    case 'video': return { ...message, ...video(wa) }
    // Custom messages
    case 'system':
    case 'button':
    case 'order':
    case 'referral':
    default:
      {
        /** @type {import('@chatally/core').Custom} */
        return {
          ...message,
          type: 'custom',
          schema: 'whatsappcloud',
          custom: wa,
        }
      }
  }
}

/**
 * @param {import('./webhooks.js').IncomingText} wa
 * @returns {import('@chatally/core').Text}
 *    A ChatAlly text request
 */
function text(wa) {
  return {
    type: 'text',
    content: wa.text.body,
  }
}

/**
 * @param {import('./webhooks.js').IncomingImage} wa
 * @returns {import('@chatally/core').Image}
 *    A ChatAlly image request
 */
function image(wa) {
  return {
    type: 'image',
    url: mediaUrlPrefix + wa.image.id,
    mimeType: wa.image.mime_type,
    caption: wa.image.caption,
  }
}

/**
 * @param {import('./webhooks.js').IncomingAudio} wa
 * @returns {import('@chatally/core').Audio}
 *    A ChatAlly audio request
 */
function audio(wa) {
  return {
    type: 'audio',
    url: mediaUrlPrefix + wa.audio.id,
    mimeType: wa.audio.mime_type,
  }
}

/**
 * @param {import('./webhooks.js').IncomingVideo} wa
 * @returns {import('@chatally/core').Video}
 *    A ChatAlly video request
 */
function video(wa) {
  return {
    type: 'video',
    url: mediaUrlPrefix + wa.video.id,
    mimeType: wa.video.mime_type,
    caption: wa.video.caption,
  }
}

/**
 * @param {import('./webhooks.js').IncomingDocument} wa
 * @returns {import('@chatally/core').Document}
 *    A ChatAlly document request
 */
function document(wa) {
  return {
    type: 'document',
    url: mediaUrlPrefix + wa.document.id,
    mimeType: wa.document.mime_type,
    caption: wa.document.caption,
    filename: wa.document.filename,
  }
}

/**
 * @param {import('./webhooks.js').IncomingLocation} wa
 * @returns {import('@chatally/core').Location}
 *    A ChatAlly location request
 */
function location(wa) {
  return {
    type: 'location',
    ...wa.location,
  }
}

/**
 * @param {import('./webhooks.js').IncomingReaction} wa
 * @returns {import('@chatally/core').Reaction}
 *    A ChatAlly reaction request
 */
function reaction(wa) {
  return {
    type: 'reaction',
    replyTo: wa.reaction.message_id,
    emoji: wa.reaction.emoji,
  }
}

/**
 * @param {import('./webhooks.js').IncomingSticker} wa
 * @returns {import('@chatally/core').Image}
 *    A ChatAlly image request
 */
function sticker(wa) {
  return {
    type: 'image',
    url: mediaUrlPrefix + wa.sticker.id,
    mimeType: wa.sticker.mime_type,
    caption: `<Sticker: ${wa.sticker.id}>`,
  }
}

/**
 * @param {import('./webhooks.js').IncomingInteractive} wa
 * @returns {import('@chatally/core').Action}
 *    A ChatAlly action request
 */
function interactive(wa) {
  if (wa.interactive.type === 'button_reply') {
    return {
      type: 'action',
      command: wa.interactive.button_reply.id,
      title: wa.interactive.button_reply.title,
    }
  } else {
    return {
      type: 'action',
      command: wa.interactive.list_reply.id,
      title: wa.interactive.list_reply.title,
      description: wa.interactive.list_reply.description,
    }
  }
}
