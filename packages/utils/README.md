# @chatally/utils

## ChatAlly Utilities

## Getting started

Install the package

```sh
npm install @chatally/utils
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
