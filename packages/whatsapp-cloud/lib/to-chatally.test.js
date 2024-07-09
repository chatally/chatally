import { toChatally } from './to-chatally.js'

describe('toChatally', () => {
  it('outputs text() description', () => {
    /** @type {import('./webhooks.js').IncomingMessage} */
    const waMessage = {
      errors: [],
      from: 'me',
      id: 'WAMID-1',
      timestamp: 'now',
      type: 'sticker',
      sticker: {
        mime_type: 'image/webp',
        sha256: 'sha123',
        id: 'teddy',
        animated: false,
      },
    }
    const chatRequest = toChatally(waMessage)
    expect(chatRequest.type).toEqual('image')
  })
})
