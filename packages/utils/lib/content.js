/**
 * @param {import('@chatally/core').ChatMessage | import('@chatally/core').Action} msg
 * @returns {string}
 *    A textual description of the message, the actual returned value depends
 *    on the type of message.
 */
export function content(msg) {
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
      return `${msg.command}: ${msg.title}`
    case 'buttons': {
      const text = msg.content || ''
      const actions = msg.actions.map(a => `<${a.command}> ${a.title}`).join('\n')
      return ([text, actions].join('\n').trim() || '<buttons>')
    }
    case 'menu': {
      const text = `${msg.title}: ${msg.content}`
      const actions = msg.sections.flatMap(s => s.actions).map(a => `<${a.command}> ${a.title}`).join('\n')
      return ([text, actions].join('\n').trim() || '<buttons>')
    }
    case 'reaction':
      return msg.emoji
    case 'image':
      return `<image> ${(
        msg.description
        || msg.caption
        || `${msg.url} (${msg.mimeType})`)}`
    case 'audio':
      return `<audio> ${(
        msg.transcript
        || msg.caption
        || `${msg.url} (${msg.mimeType})`)}`
    case 'video':
      return `<video> ${(
        msg.transcript
        || msg.caption
        || `${msg.url} (${msg.mimeType})`)}`
    case 'document':
      return `<document> ${(
        msg.description
        || msg.caption
        || msg.filename
        || '')}`.trim()
    case 'custom':
      return `<custom> ${JSON.stringify(msg.custom)}`
    default:
      return `<unknown> ${JSON.stringify(msg)}`
  }
}
