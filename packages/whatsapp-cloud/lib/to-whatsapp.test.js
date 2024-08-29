import { toWhatsApp } from './to-whatsapp.js'

/** @param {string} _id  */
async function upload(_id) {
  return `<mediaid>`
}

describe('toWhatsApp', () => {
  it('normalizes Markdown in text messages', async () => {
    /** @type {import('@chatally/core').ChatMessage} */
    const chatMessage = {
      type: 'text',
      content: '__This__ is a ~~bad~~**great** idea',
    }
    const waMessage = await toWhatsApp(chatMessage, upload)
    expect(waMessage).toStrictEqual({
      type: 'text',
      text: {
        body: '_This_ is a ~bad~*great* idea',
      },
    })
  })
  it('normalizes Markdown in images', async () => {
    /** @type {import('@chatally/core').ChatMessage} */
    const chatMessage = {
      type: 'image',
      mimeType: 'png',
      url: 'file://foo.png',
      caption: '__This__ is a ~~bad~~**great** idea',
    }
    const waMessage = await toWhatsApp(chatMessage, upload)
    expect(waMessage).toStrictEqual({
      type: 'image',
      image: {
        caption: '_This_ is a ~bad~*great* idea',
        id: '<mediaid>',
      },
    })
  })
})
