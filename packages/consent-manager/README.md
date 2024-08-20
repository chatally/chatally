# @chatally/consent-manager

**ChatAlly Consent Manager** middleware to comply with GDPR requirements.

The consent manager should be added to a ChatAlly application as one of the first middleware modules, to check, if the sender of an incoming request has consented to automatic processing of their data. If not, the sender is asked for consent before processing continues.

Consent data is persisted in a local SQLite database.

> This package is meant to be used within a [ChatAlly](https://chatally.org) chatbot application.

## Usage

Install the package

```sh
npm install @chatally/consent-manager
```

Use the middleware

```js
// index.js
import { ConsoleServer } from '@chatally/console'
import { Application } from '@chatally/core'
import { content } from '@chatally/utils'
import { GdprConsent } from './lib/index.js'

const app = new Application({ log: false })

app //
  .use(new ConsoleServer("Bot"))
  .use(new GdprConsent())
  .use(({ req, res }) => {
    res.write(`You said: ${content(req)}`)
  })
  .listen()
```

## Documentation

Find the full documentation at https://chatally.org/reference/middleware/consent-manager/.
