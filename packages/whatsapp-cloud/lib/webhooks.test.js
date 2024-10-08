import { BaseLogger } from '@chatally/logger'
import { StringWritable } from '@internal/test-utils'
import supertest from 'supertest'
import { Webhooks } from './webhooks.js'

class _Webhooks extends Webhooks {
  /** @param {import('./webhooks.d.ts').WebhooksConfig} [config] */
  constructor(config) {
    super(config)
    this.app = supertest(this._app)
  }
}

/**
 * @param {string} from
 * @param {string} text
 */
function text(from, text) {
  return {
    entry: [
      {
        message: { from, text },
      },
    ],
  }
}

describe('webhooks', () => {
  describe('register', () => {
    it('accepts with no verifyToken configured', async () => {
      const webhooks = new _Webhooks()
      const res = await webhooks.app.get(
        '/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123',
      )
      expect(res.status).toEqual(200)
      expect(res.text).toEqual('123')
    })
    it('accepts with correct verifyToken', async () => {
      const webhooks = new _Webhooks({ verifyToken: 'abc' })
      const res = await webhooks.app.get(
        '/?hub.mode=subscribe&hub.verify_token=abc&hub.challenge=123',
      )
      expect(res.status).toEqual(200)
      expect(res.text).toEqual('123')
    })
    it('fails with incorrect verifyToken', async () => {
      const webhooks = new _Webhooks({ verifyToken: 'abc' })
      const res = await webhooks.app.get(
        '/?hub.mode=subscribe&hub.verify_token=def&hub.challenge=123',
      )
      expect(res.status).toEqual(401)
      expect(res.text).toEqual('Verification failed')
    })
    it('fails for arbitrary requests', async () => {
      const webhooks = new _Webhooks({ verifyToken: 'abc' })
      const res = await webhooks.app.get('/')
      expect(res.status).toEqual(401)
      expect(res.text).toEqual('Verification failed')
    })
    it('fails for arbitrary requests, also with no verifyToken configured', async () => {
      const webhooks = new _Webhooks()
      const res = await webhooks.app.get('/')
      expect(res.status).toEqual(401)
      expect(res.text).toEqual('Verification failed')
    })
  })
  describe('verifySignature', () => {
    it('accepts without secret', async () => {
      const webhooks = new _Webhooks()
      const res = await webhooks.app.post('/').send(text('me', 'foo'))
      expect(res.status).toEqual(200)
      expect(res.text).toEqual('OK')
    })
    it('accepts with correct signature', async () => {
      const webhooks = new _Webhooks({ secret: 'abc' })
      const res = await webhooks.app
        .post('/')
        .set(
          'x-hub-signature-256',
          'sha256=14628c8cd96535a55d0be7b1f18b73d4ce2f5f9e1007a0272fef421700dac174',
        )
        .send(text('me', 'foo'))
      expect(res.status).toEqual(200)
      expect(res.text).toEqual('OK')
    })
    it('fails without body (Bad Request)', async () => {
      const webhooks = new _Webhooks()
      const res = await webhooks.app.post('/')
      expect(res.status).toEqual(400)
      expect(res.text).toEqual('No data received')
    })
    it('fails for unsigned content (Bad Request)', async () => {
      const webhooks = new _Webhooks({ secret: 'abc' })
      const res = await webhooks.app.post('/').send(text('me', 'foo'))
      expect(res.status).toEqual(400)
      expect(res.text).toEqual('Missing header \'x-hub-signature-256\'.')
    })
    it('fails for incorrect signature (Bad Request)', async () => {
      const log = new BaseLogger({ name: 'root', level: 'debug' })
      log.out = new StringWritable()
      log.timestamp = false
      const webhooks = new _Webhooks({ secret: 'abc', log })
      const res = await webhooks.app
        .post('/')
        .set('x-hub-signature-256', 'sha256=foo')
        .send(text('me', 'foo'))
      expect(res.status).toEqual(400)
      expect(res.text).toEqual('Invalid \'x-hub-signature-256\'.')
      // console.log(log.out.data);
    })
  })
})
