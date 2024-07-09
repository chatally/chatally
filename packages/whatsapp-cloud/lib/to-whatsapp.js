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
      // TODO: Chack validity of input, i.e. at most 3 buttons
      return {
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: message.content,
          },
          action: {
            buttons: message.actions.map(a => ({
              type: 'reply',
              reply: a,
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
          caption: message.caption,
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
            caption: message.caption,
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
            text: message.content,
          },
          action: {
            button: message.title,
            sections: message.sections.map(s => ({
              title: s.title,
              rows: s.actions,
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
          body: message.content,
        },
      }
    case 'video':
      return {
        type: 'video',
        video: {
          id: await upload(message.url),
          caption: message.caption,
        },
      }
  }
}
