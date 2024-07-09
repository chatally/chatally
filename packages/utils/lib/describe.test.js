import { describe as describeFn } from './describe.js'

describe('describe', () => {
  it('handles unknown message type', () => {
    const msg = {
      type: 'manual',
    }
    // @ts-ignore
    const actual = describeFn(msg)
    expect(actual).toEqual('unknown message type: {"type":"manual"}')
  })
})
