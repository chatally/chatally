# @chatally/whatsapp-cloud

**WhatsApp Cloud Server** is a ChatAlly server that integrates the WhatsApp endpoints
[Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks),
[Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) and
[Media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media) into one ChatAlly module.

> This package is meant to be used within a [ChatAlly](https://chatally.org) chatbot application.

## Usage

Install the required packages

```sh
npm install @chatally/core @chatally/whatsapp-cloud
```

Create a main module, that sets up the WhatsApp cloud server and integrates it with your ChatAlly application.

```js
import { Application } from '@chatally/core'
import { WhatsAppCloud } from './lib/index.js'

const phoneNumberId = 'YOUR PHONE NUMBER'
const accessToken = 'YOUR ACCESS TOKEN'
const verifyToken = 'YOUR WEBHOOKS VERIFY TOKEN'
const secret = 'YOUR WEBHOOKS VALIDATION SECRET'

const whatsapp = new WhatsAppCloud({
  env: false, // do not read configuration from environment variables
  file: false, // do not read configuration from default configuration files
  graphApi: { phoneNumberId, accessToken },
  webhooks: { verifyToken, secret },
})

new Application() //
  .use(whatsapp)
  .use(({ req, res }) => {
    if (res.isWritable) {
      res.write(`You said '${req.content}' and I don't know what it means.`)
    }
  })
  .listen()
```

## Documentation

Find the full documentation at https://chatally.org/reference/servers/whatsapp-cloud.
