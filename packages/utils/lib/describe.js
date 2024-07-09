/**
 * @param {import('@chatally/core').ChatMessage | import('@chatally/core').Action} msg
 * @returns {string}
 *    A textual description of the message, the actual returned value depends
 *    on the type of message.
 */
export function describe(msg) {
  switch (msg.type) {
    case 'text':
      return msg.content
    case 'location':
      return (
        msg.name
        || msg.address
        || `location: lon ${msg.longitude} lat ${msg.latitude}`
      )
    case 'action':
      return `${msg.id}: ${msg.title}`
    case 'buttons':
      return (
        msg.content
        || msg.actions.map(a => a.title).join(', ')
        || '<buttons>'
      )
    case 'menu':
      return `${msg.title}: ${msg.content}`
    case 'reaction':
      return msg.emoji
    case 'image':
      return (
        msg.description
        || msg.caption
        || `image: ${msg.url} (${msg.mimeType}))`
      )
    case 'audio':
      return (
        msg.transcript
        || msg.caption
        || `audio: ${msg.url} (${msg.mimeType})`
      )
    case 'video':
      return (
        msg.transcript
        || msg.caption
        || `video: ${msg.url} (${msg.mimeType})`
      )
    case 'document':
      return (
        msg.description
        || msg.caption
        || msg.filename
        || '<document>'
      )
    case 'custom':
      return `custom:${JSON.stringify(msg.custom)}`
    default:
      return `unknown message type: ${JSON.stringify(msg)}`
  }
}
