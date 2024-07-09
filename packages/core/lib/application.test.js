import { BaseLogger } from '@chatally/logger'
import { StringWritable, TestError } from '@internal/test-utils'
import { nanoid } from 'nanoid'
import { Application } from './application.js'
import { ChatResponse } from './chat-response.js'

/** @type {import('./middleware.d.ts').Middleware<unknown>} */
const echo = ({ req, res }) => {
  if (res.isWritable && req.type === 'text') {
    res.write(`Echo: '${req.content}'`)
  }
}

describe('application', () => {
  it('dispatches to middleware', async () => {
    const app = new Application().use(echo)

    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    const actual = res.messages.map(toText)
    expect(actual).toStrictEqual(['Echo: \'foo\''])
  })

  it('dispatches in order of registration', async () => {
    const app = new Application()
      .use(function a({ res }) {
        // should run before all middlewares
        res.write('a')
      })
      .use(async function b({ res, next }) {
        // should run after all following middlewares
        await next()
        res.write('b')
      })
      .use(async function c({ res, next }) {
        // should run before and after all following middlewares
        res.write('c-pre')
        await next()
        res.write('c-post')
      })
      .use(async function d({ res }) {
        await new Promise(resolve => setTimeout(resolve, 1))
        res.write('d')
      })
      .use(function e({ res }) {
        res.write('e')
      })

    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    const actual = res.messages.map(toText)
    expect(actual).toStrictEqual(['a', 'c-pre', 'd', 'e', 'c-post', 'b'])
  })

  it('catches sync middleware errors', async () => {
    /** @type {Error} */
    let error = new Error('Init')
    const app = new Application()
      .use(echo)
      .use(() => {
        throw new Error('Boom')
      })
      .on('error', (err) => {
        error = err
      })
    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    const actual = res.messages.map(toText)
    expect(actual).toStrictEqual(['Echo: \'foo\''])
    expect(error?.message).toBe('Boom')
  })

  it('catches async middleware errors', async () => {
    async function throwsAsync() {
      throw new Error('Boom Async')
    }
    const app = new Application()
      .use(echo)
      .use(function throws({ res }) {
        throwsAsync().catch(e => res.write(e.message))
        res.write('First')
      })
    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    const actual = res.messages.map(toText)
    expect(actual).toStrictEqual(['Echo: \'foo\'', 'First', 'Boom Async'])
  })

  it('exposes errors if demanded', async () => {
    const app = new Application()
      .use(echo)
      .use(() => {
        throw new Error('Bang')
      })
      .use(() => {
        throw new TestError('Boom', { expose: true })
      })
      .on('error', (err, { res }) => {
        if (err.expose) {
          res.write(err.message)
        }
      })

    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    const actual = res.messages.map(toText)
    expect(actual).toStrictEqual(['Echo: \'foo\'', 'Boom'])
  })

  it('warns about unnamed middleware', async () => {
    const log = new BaseLogger({ name: 'root', level: 'warn' })
    const logged = new StringWritable()
    log.out = logged
    log.timestamp = false

    new Application({ log })
      // unnamed middleware
      .use(() => { })
    expect(logged.data.startsWith('WARN (root):')).toBeTruthy()
  })

  it('logs middleware output', async () => {
    const log = new BaseLogger({ level: 'warn' })
    const logged = new StringWritable()
    log.out = logged
    log.timestamp = false

    const app = new Application({ log }) //
      .use(function logs({ log }) {
        log.level = 'debug'
        log.debug('Hello')
      })

    const res = new ChatResponse()
    await app.dispatch(textRequest('foo', 'test'), res)
    expect(logged.data).toBe('DEBUG (logs): Hello\n')
  })
})

/**
 * @param {any} content
 * @param {any} from
 * @returns {import('./chat-request.js').ChatRequest}
 *    Text request with the given content
 */
function textRequest(content, from) {
  return {
    source: 'test',
    type: 'text',
    content,
    timestamp: Date.now(),
    from,
    id: nanoid(),
  }
}

/**
 * @param {import('./chat-message.js').ChatMessage} msg
 */
function toText(msg) {
  if (msg.type === 'text') {
    return msg.content
  }
  return `<${msg.type}>`
}
