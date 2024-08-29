/**
 * @param {import('@chatally/core').ChatMessage} message
 * @param {(url: string) => Promise<string>} upload
 * @returns {Promise<import('./messages.js').Message>}
 *    An outgoing WhatsApp message (from the Message API)
 */
export async function toWhatsApp(message, upload) {
  switch (message.type) {
    case 'audio':
      return {
        type: 'audio',
        audio: {
          id: await upload(message.url),
        },
      }
    case 'buttons':
      // TODO: Check validity of input, i.e. at most 3 buttons
      return {
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: normalizeText(message.content),
          },
          action: {
            buttons: message.actions.map(a => ({
              type: 'reply',
              reply: {
                id: a.command,
                title: a.title,
              },
            })),
          },
        },
      }
    case 'custom':
      return /** @type {import('./messages.js').Message} */ (message.custom)
    case 'document':
      return {
        type: 'document',
        document: {
          id: await upload(message.url),
          caption: normalizeText(message.caption),
          filename: message.filename,
        },
      }
    case 'image':
      if (message.mimeType === 'image/webp') {
        return {
          type: 'sticker',
          sticker: {
            id: await upload(message.url),
          },
        }
      } else {
        return {
          type: 'image',
          image: {
            id: await upload(message.url),
            caption: normalizeText(message.caption),
          },
        }
      }
    case 'location':
      return {
        type: 'location',
        location: message,
      }
    case 'menu':
      // TODO: Check validity of menu input
      return {
        type: 'interactive',
        interactive: {
          type: 'list',
          body: {
            text: normalizeText(message.content),
          },
          action: {
            button: message.title,
            sections: message.sections.map(s => ({
              title: s.title,
              rows: s.actions.map(a => ({
                id: a.command,
                title: a.title,
                description: a.description,
              })),
            })),
          },
        },
      }
    case 'reaction':
      return {
        type: 'reaction',
        reaction: {
          message_id: message.replyTo,
          emoji: message.emoji,
        },
      }
    case 'text':
      return {
        type: 'text',
        text: {
          body: normalizeText(message.content),
        },
      }
    case 'video':
      return {
        type: 'video',
        video: {
          id: await upload(message.url),
          caption: normalizeText(message.caption),
        },
      }
  }
}

/**
 * @template {string|undefined} T
 * @param {T} text
 * @returns {T}
 */
function normalizeText(text) {
  if (text === undefined) {
    return text
  }
  return /** @type {T} */ (text //
    .replace(/\*\*(.*?)\*\*/g, '*$1*')
    .replace(/__(.*?)__/g, '_$1_')
    .replace(/~~(.*?)~~/g, '~$1~'))
}
