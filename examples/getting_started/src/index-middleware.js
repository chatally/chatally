import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'

/** @param {number} seconds */
async function sleep(seconds) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000))
}

new Application({
  data: {
    aName: '',
    bName: '',
  },
}) //
  .use(new ConsoleServer('ChatAlly'))
  .use(async function a({ res, next, data }) {
    // You can await promises in your middleware,
    // your middleware will also be awaited by the application
    await sleep(1)
    res.write('My name is Anne. What is your name?')
    data.aName = 'Anne'
    // Execute the rest of this middleware on the downstream leg
    await next()
    // Results from following middleware should now be accessible
    if (data.bName) {
      res.write(`I guess ${data.bName} said something, too.`)
    }
  })
  .use(async function b({ res, data, log }) {
    await sleep(1)
    res.write('My name is Bob.')
    data.bName = 'Bob'
    // Define a (async) background task
    const bgTask = async () => {
      await sleep(2)
      log.info('Something happened in the background.')
    }
    // Do not await background tasks
    bgTask()
  })
  .listen()
