/**
 * @param {import("./message.d.ts").Message} msg
 * @returns {string}
 */
export function text (msg) {
  switch (msg.type) {
    case 'audio':
      return (
        msg.audio.transcript ||
        msg.audio.caption ||
        `audio: ${msg.audio.url} (${msg.audio.mimeType})`
      )
    case 'buttons':
      return (
        msg.buttons.text ||
        msg.buttons.actions.map((a) => a.title).join(', ') ||
        '<buttons>'
      )
    case 'custom':
      return 'custom:' + JSON.stringify(msg.custom)
    case 'document':
      return (
        msg.document.description ||
        msg.document.caption ||
        msg.document.filename ||
        '<document>'
      )
    case 'image':
      return (
        msg.image.description ||
        msg.image.caption ||
        `image: ${msg.image.url} (${msg.image.mimeType}))`
      )
    case 'location':
      return (
        msg.location.name ||
        msg.location.address ||
        `location: lon ${msg.location.longitude} lat ${msg.location.latitude}`
      )
    case 'menu':
      return `${msg.menu.title}: ${msg.menu.text}`
    case 'reaction':
      return msg.reaction.emoji
    case 'action':
      return `${msg.action.id}: ${msg.action.title}`
    case 'text':
      return msg.text
    case 'video':
      return (
        msg.video.transcript ||
        msg.video.caption ||
        `video: ${msg.video.url} (${msg.video.mimeType})`
      )
  }
  // return "unknown:" + JSON.stringify(msg);
}
