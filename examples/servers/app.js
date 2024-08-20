import { Application } from '@chatally/core'
import { audio, describe, image } from '@chatally/utils'
import { GraphApiMock, WhatsAppCloud } from '@chatally/whatsapp-cloud'
import 'dotenv/config'

/**
 * Firstly, we setup a WhatsApp Cloud Server, where all configuration is read
 * from a .env file:
 *
 * - WHATSAPP_CLOUD_GRAPHAPI_PHONE_NUMBER_ID
 * - WHATSAPP_CLOUD_GRAPHAPI_ACCESS_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_VERIFY_TOKEN
 * - WHATSAPP_CLOUD_WEBHOOKS_SECRET
 *
 * You have to set these values up in your WhatsApp Cloud application dashboard.
 * The following page in .jsMeta for Developers" explains how to do that in
 * general. This explanation includes an endpoint that you should implement.
 * You do not have to implement that endpoint, that is what ChatAlly's WhatsApp
 * Cloud Server does for you.
 *
 * https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks-product.
 *
 * Find a detailed explanation, how we deploy our example in a Docker container
 * behind a Traefik proxy from a Github action here:
 *
 * https://chatally.org/examples/whatsapp-cloud
 *
 * Just deploy it to some publicly available URL (potentially including a path,
 * in case you are running multiple ChatAlly servers on the same domain).
 */
const whatsapp = new WhatsAppCloud({
  graphApi: new GraphApiMock({
    phoneNumberId: '1234',
    accessToken: 'ABCD',
  }),
  webhooks: { path: '/whatsappcloud' },
  messages: { sequential: false },
})

new Application({
  log: { name: 'App', level: 'trace' },
  media: { ttl: 30, ttl2: 240 },
}) //
  .use(whatsapp)
  // .use(signal)
  /**
   * Middleware to describe images without caption/description by image
   * recognition.
   */
  .use(async function describeImage({ req, res, media }) {
    if (!res.isWritable) return
    if (req.type !== 'image') return
    if (req.caption) return
    if (req.description) return

    try {
      const raw = await media.load(req)
      const description = await imageRecognition(raw)
      if (description) {
        req.description = description
      } else {
        res.write(`You sent me an image without any text (${raw.length}bytes, ${req.mimeType}) and I do not recognize it.
  Can you please describe it for me?`)
      }
    } catch (_e) {
      res.write(`Something went wrong, I cannot see the image you sent! Can you describe what's in it?
Image URL: ${req.url}`)
    }
  })
  .use(function echo({ req, res }) {
    if (!res.isWritable || res.messages.length > 0) return

    const text = describe(req)
    if (text.match(/\bcats?\b/)) {
      res.write(image(
        'media/cat.jpg',
        'I love cats. How do you like this one, isn\'t it cute?',
      ))
    } else if (text.match(/\bvoice\b/)) {
      res.write(audio(
        'media/voice.mp3',
        'Do you like my voice?',
      ))
    } else {
      // This markdown needs to be normalized according to the output channel
      res.write(`You said __"${text}"__ and **I don't know** what it means.`)
    }
  })
  .listen()

/**
 * Just some mock image recognition
 * @param {Buffer} _buffer
 */
async function imageRecognition(_buffer) {
  return undefined
}
