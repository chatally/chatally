import { deepMerge } from './deep-merge.js'

describe('deepMerge', () => {
  it('merges simple objects', () => {
    const actual = deepMerge(
      { a: { a1: 1, a2: 3 }, b: 'c' },
      { a: { a2: 2, a3: 3 }, b: 'b' },
    )
    expect(actual).toStrictEqual(
      { a: { a1: 1, a2: 2, a3: 3 }, b: 'b' },
    )
  })
  it('does not merge class instances', () => {
    const actual = deepMerge(
      { obj: new Foo({ a: { a1: 1, a2: 3 }, b: 'c' }) },
      { obj: { a: { a2: 2, a3: 3 }, b: 'b' } },
    )
    expect(actual).toStrictEqual(
      { obj: { a: { a2: 2, a3: 3 }, b: 'b' } },
    )
  })
  it('throws for top level class instances', () => {
    expect(() => deepMerge(
      new Foo({ a: { a1: 1, a2: 3 }, b: 'c' }),
      { a: { a2: 2, a3: 3 }, b: 'b' },
    )).toThrow('Foo')
  })
})

class Foo {
  foo = 'foo'
  /**
   * @param {object} obj
   */
  constructor(obj) {
    Object.assign(this, obj)
  }
}
