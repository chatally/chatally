# @chatally/core

## ChatAlly Core

## Getting started

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
      res.write(`You said '${req.text}'`)
    }
  })
  .listen()
```

## Documentation

Find the full documentation at https://chatally.org/guides.
