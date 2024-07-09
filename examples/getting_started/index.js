import { Application } from '@chatally/core'
import { ConsoleServer } from '@chatally/console'
import { nlpjsMiddleware, trainNlp } from '@chatally/nlpjs'

const app = new Application({ log: false })
const nlp = await trainNlp(app.getLogger('nlp.js'))

app //
  .use(new ConsoleServer())
  .use(nlpjsMiddleware(nlp))
  .listen()
