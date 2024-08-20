import { content } from "./content.js"

describe('content', () => {
  it('handles unknown message type', () => {
    const msg = {
      type: 'manual',
    }
    // @ts-ignore
    const actual = content(msg)
    expect(actual).toEqual('unknown message type: {"type":"manual"}')
  })
})
