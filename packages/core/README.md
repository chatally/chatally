# @chatally/core

**ChatAlly Core** contains the application components and types for creating a chatbot application. It resembles the structure of an Express web server, but for chat applications.

The whole framework is very modular and extendible. It provides some middleware and servers (which are used to communicate with chat clients like WhatsApp or Signal), that you can use to create your individual chat application.

[See all ChatAlly packages](https://www.npmjs.com/search?q=chatally).

Help the community and publish your own ChatAlly modules with the tag `chatally`.

## Usage

Install the package and for testing a console chat server

```sh
npm install @chatally/core @chatally/console
```

Use the application

```js
// index.js
import { Application } from '@chatally/core'
import { ConsoleServer } from '@chatally/console'

new Application({ log: false }) //
  .use(new ConsoleServer())
  .use(({ req, res }) => {
    if (res.isWritable) {
      res.write(`You said '${req.content}'`)
    }
  })
  .listen()
```

## Documentation

Find the full documentation at https://chatally.org/guides.
