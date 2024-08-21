import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'
import { nlpjsMiddleware, trainNlp } from '@chatally/nlpjs'

const app = new Application({ log: false })
const nlp = await trainNlp(app.getLogger('nlp.js'))

app //
  .use(new ConsoleServer('nlp.js'))
  .use(nlpjsMiddleware(nlp))
  .listen()
