---
title: 🚀 Getting started
---

If you are a web developer and know how to host a web application with Express and [node.js](https://nodejs.org), ChatAlly will only surprise you with it's ease of use.

## 🏗️ Installation

To get started, with the simplest possible chat application, you need to create an npm ESM project, install the core library, a chat server, e.g. the `ConsoleServer` and add some middleware.

```sh
npm init esnext -y
npm install @chatally/core @chatally/console
```

## ✍ Create the application

Create a file `index.js` in which you configure your application

```js
// index.js
import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'

new Application({ log: false }) //
  .use(new ConsoleServer("ChatAlly"))
  .use(({ req, res }) => {
    if (res.isWritable) {
      res.write(`You said '${req.content}'`)
    }
  })
  .listen()
```

Here we create a new chat application, register the `ConsoleServer` and implement a very simple middleware, that just echoes the user input.

ChatAlly is fully typed, so you can get full support from your code editor (you might need to setup a tsconfig.json file).

See the guide [Writing Middleware](/guides/middleware) for details on how to write your own middleware.

You can now start the application by running

```sh
node index.js
```

## 🥪 Add middleware

Of course, this chatbot is quite boring, but you can make it more interesting by adding some middleware, e.g. a module for NLP (Natural Language Processing) like [nlp.js](/reference/middleware/nlpjs).

Install the module

```sh
npm install @chatally/nlpjs
```

and add it to your configuration instead of the function `echo`

```js
// index.js
import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'
import { nlpjsMiddleware, trainNlp } from '@chatally/nlpjs'

const app = new Application({ log: false })
const nlp = await trainNlp(app.getLogger('nlp.js'))

app //
  .use(new ConsoleServer("nlp.js"))
  .use(nlpjsMiddleware(nlp))
  .listen()
```

The function `trainNlp` creates a trained NLP module and expects a training corpus at `corpus.json`. For this example you can [download a corpus.json](https://raw.githubusercontent.com/axa-group/nlp.js/master/examples/04-qna-web/corpus.json) from nlp.js' Github. We integrate nlp.js' logging with ChatAlly's by passing a logger from the application to nlp.js.

The function `nlpjsMiddleware` wraps the nlp.js `Nlp.process(...)` method in a ChatAlly middleware function.

Now it should be a bit more fun talking to your chatbot.

For details how to train your NLP, see the [nlp.js documentation](https://github.com/axa-group/nlp.js).

## 🤖 What next

The console server limits your audience severely, so maybe you want to try to connect your chatbot with [WhatsApp](/reference/servers/whatsapp-cloud) and [deploy it](/guides/deployment) to a publicly accessible server.

You could also add more or different middleware, explore the [middleware](/reference/middleware) section in the sidebar or start [writing your own middleware](/guides/middleware) to add any missing piece.

If you first want to learn more about the core concepts, check out the [reference documentation](/reference/core).
