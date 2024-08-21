import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'
import { content } from '@chatally/utils'

new Application({ log: false }) //
  .use(new ConsoleServer('ChatAlly'))
  .use(({ req, res }) => {
    if (res.isWritable) {
      res.write(`You said '${content(req)}'`)
    }
  })
  .listen()
