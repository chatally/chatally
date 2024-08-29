import { Application } from '@chatally/core'
import { nlpjsMiddleware, trainNlp } from '@chatally/nlpjs'
import { WhatsAppCloud } from '@chatally/whatsapp-cloud'

const app = new Application({ log: false })
const nlp = await trainNlp(app.getLogger('nlp.js'))

app //
  .use(new WhatsAppCloud({
    webhooks: { path: '/whatsappcloud' },
    media: { dbPath: './data/media-ids.db' },
  }))
  .use(nlpjsMiddleware(nlp))
  .listen()
