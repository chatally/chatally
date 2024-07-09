import { image } from './chat-messages.js'

describe('media', () => {
  it('resolves relative file path', () => {
    const msg = image('./media/cat.jpg')
    expect(msg.url.startsWith('file:///')).toBeTruthy()
    expect(msg.url.endsWith('/media/cat.jpg')).toBeTruthy()
    expect(msg.url).not.toEqual('file:///media/cat.jpg')
  })
  it('resolves absolute file path', () => {
    const msg = image('/media/cat.jpg')
    expect(msg.url).toEqual('file:///media/cat.jpg')
  })
  it('resolves relative file URL', () => {
    const byPath = image('./media/cat.jpg')
    const byUrl = image('file://media/cat.jpg')
    expect(byUrl.url).toEqual(byPath.url)
  })
  it('leaves absolute file URL untouched', () => {
    const msg = image('file:///media/cat.jpg')
    expect(msg.url).toEqual('file:///media/cat.jpg')
  })
  it('leaves other protocols untouched', () => {
    const msg = image('media://whatsappcloud/your_media_id')
    expect(msg.url).toEqual('media://whatsappcloud/your_media_id')
  })
  it('throws on invalid URL', () => {
    expect(() => image('media://whatsapp cloud.jpg')).throws('Invalid URL')
  })
})
