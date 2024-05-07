---
title: Getting started
---

A web application starts off with an HTTP server that creates a request and an empty response object and hands it over to the application framework, e.g. Express or Koa to generate a response.

A ChatAlly chat application is very similar: It starts off with a chat server that creates a request and response object and hands it over to the ChatAlly application. The application dispatches it to all the middleware that should generate the response and returns it to the server to send it out to the user client.

## Installation

To get started, with the simplest possible chat application, you need to install the core library, a chat server and implement some middleware. As chat server for development you can use the `ConsoleServer`.

Install the core library and the console server

```sh
npm install @chatally/core @chatally/console
```

## Configure the application

Create a file `index.js` in which you configure your application

```js
// index.js
import { Application } from "@chatally/core";
import { ConsoleServer } from "@chatally/console";

// Configure the application
new Application({ log: false }) //
  .use(new ConsoleServer())
  .use(function echo({ req, res }) {
    if (res.isWritable) {
      res.write(`You said '${req.text}'`);
    }
  })
  .listen();
```

Here we create a new chat application, register the `ConsoleServer` and a very simple middleware, that just echoes the user input. ChatAlly is fully typed, so you get full support from your code editor. See the guide [Writing Middleware](/guides/middleware) for details on how to write your own middleware.

You can now start the application by running

```sh
node index.js
```

## Adding middleware

Of course, this chatbot is quite boring, but you can make it more interesting by adding some middleware, e.g. a module for NLP (Natural Language Processing) like [nlp.js](/reference/middleware/nlpjs).

Install the module

```sh
npm install @chatally/nlpjs
```

and add it to your configuration instead of the function `echo`

```js
// index.js
import { Application } from "@chatally/core";
import { ConsoleServer } from "@chatally/console";
import { trainNlp, nlpjsMiddleware } from "@chatally/nlpjs";

const app = new Application({ log: false });
const nlp = await trainNlp(app.getLogger("nlp.js"));

app //
  .use(new ConsoleServer())
  .use(nlpjsMiddleware(nlp))
  .listen();
```

The function `trainNlp` creates a trained NLP module and expects a training corpus at `corpus.json`. For this example you can [download a corpus.json](https://raw.githubusercontent.com/axa-group/nlp.js/master/examples/04-qna-web/corpus.json) from nlp.js' Github. We integrate nlp.js' logging with ChatAlly's by passing a logger from the application.

The function `nlpjsMiddleware` wraps the nlp.js `process` method in a ChatAlly middleware function.

Now it should be a bit more fun talking to your chatbot.

## Passing data

## Error handling

## Logging
