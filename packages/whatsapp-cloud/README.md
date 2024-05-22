# @chatally/whatsapp-cloud

## WhatsApp Cloud Server

WhatsApp Cloud is a ChatAlly server that integrates the WhatsApp endpoints
[Webhooks](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks),
[Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages) and
[Media](https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media).

## Usage

Install the required packages

```sh
npm install @chatally/core @chatally/whatsapp-cloud
```

Create a main module, that sets up the WhatsApp cloud server and integrates it with your Chatally application.

```js
import { Application } from "@chatally/core";
import { WhatsAppCloud } from "./lib/index.js";

const phoneNumberId = "YOUR PHONE NUMBER";
const accessToken = "YOUR ACCESS TOKEN";
const verifyToken = "YOUR WEBHOOKS VERIFY TOKEN";
const secret = "YOUR WEBHOOKS VALIDATION SECRET";

const whatsapp = new WhatsAppCloud({
  env: false, // do not read configuration from environment variables
  file: false, // do not read configuration from default configuration files
  graphApi: { phoneNumberId, accessToken },
  webhooks: { verifyToken, secret },
});

new Application() //
  .use(whatsapp)
  .use(function echo({ req, res }) {
    if (res.isWritable) {
      res.write(`You said '${req.text}' and I don't know what it means.`);
    }
  })
  .listen();
```

`use(...)` registers the WhatsApp cloud server as a [server](https://chatally.org/reference/core/servers) in your ChatAlly application and hence connects it with your response-generating middleware.

The ChatAlly application will be calling the method `listen(...)` to start the integrated Webhooks endpoint. Once this is started, you can [register your WhatsApp business account](https://developers.facebook.com/docs/whatsapp/cloud-api/guides/set-up-webhooks) to receive notifications, whenever your WhatsApp phone number receives a message or a status update.

Registration is only required once.

## Configuration

To set up a WhatsApp Cloud server, you must provide some configuration, either explicitly as a Javascript object, a configuration file, environment variables or a combination of it. A minimal configuration must contain:

- `graphApi.phoneNumberId` The id of the registered WhatsApp number.
- `graphApi.accessToken` A cryptographic token used as `Authorization: Bearer` in each call to an endpoint. See the Facebook documentation on [how to create access tokens](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#access-tokens).
- `webhooks.verifyToken` A shared secret used to [register the webhooks endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests) with your WhatsApp business account.
- `webhooks.secret` A cryptographic token to verify the payload of received [event notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications) on the webhooks endpoint.

This is an example configuration file (`whatsapp-cloud.config.yaml`) with all configuration options:

```yaml
# name: WhatsAppCloud
# immediate: false
webhooks:
  # [Optional] Port to listen on [`default=3000`]
  # port: 3000
  # [Optional] directory to static assets to be served at assetsPath
  # assetsDir: ./assets
  # [Optional] file path to static assets, has no effect if assetsDir is not set
  # assetsPath: "/assets"
  # Look these up in your WhatsApp Business settings
  # Token to verify webhooks registration
  verifyToken: <YOUR VERIFY TOKEN>
  # Secret to verify payload signatures
  secret: <YOUR SECRET>
graphApi:
  # [Optional] Base URL for Meta GraphAPI
  # baseUrl: "graph.facebook.com"
  # [Optional] Port at which to reach Meta GraphAPI
  # basePort: undefined
  # [Optional] Version of the Meta GraphAPI
  # version: 20
  # Look these up in your WhatsApp Business settings
  # the phone number id of the WhatsApp business account
  phoneNumberId: <YOUR PHONE NUMBER>
  # Access token to use as authorization bearer.
  accessToken: <YOUR ACCESS TOKEN>
media:
  # [Optional] Path to a directory where to store downloaded media assets
  # [default="media"]
  downloadDir: ./wa-media
  # [Optional] Path to the database to store media ids
  # [default="media.db"]
  dbPath: ./wa-media/media-ids.db
```

## Reference

If you do not use the WhatsApp Cloud server in a Chatally application, you have to register a `dispatch` method explicitly and call `listen()` to start the server.

### `set dispatch(dispatch: Dispatch)`

Set the dispatch method to generate a response.

You must set this beforte calling `listen()`.

- `dispatch` Method that generates responses.

Dispatch must be a function (sync or async) that takes a Request and a Response and returns void.

### `listen(port?: number): void`

Start the underlying Webhooks API server.

This call is long-running and will only return, once the server has stopped. You must set `dispatch` before starting to listen, otherwise notifications would have no effect.

- `port` [Optional] Port to listen on with the Webhooks server.

See https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks.

---

Independent of the way you integrate the server, you can use some functionality of the integrated endpoints through the server's interface.

### `async send(to: string, ...outgoing: OutgoingMessage[]): Promise<void>`

Send message(s) to recipient.

Messages are sent "in order" once the Webhooks server has been started
with a call to `listen()`, i.e. the next message to the same recipient is
only sent out, once a `delivered` status has been received.

- `to` recipient's phone number, with country code but without `+`.
- `...outgoing` one or more messages to send.

### `async upload(file: string): Promise<string>`

Upload a file to Facebook's media endpoint.

- `file` Path to the file to be uploaded.
- `@returns` the media id that can be referenced in messages

### `async download(id): Promise<string>`

- `id` Media id of the asset to be downloaded to `downloadDir`.
- `@returns` the file path to the downloaded file

## See also the WhatsApp Business Documentation

### Cloud API

- https://developers.facebook.com/docs/whatsapp/cloud-api

### Webhooks

- https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/components
- https://developers.facebook.com/docs/graph-api/webhooks
- https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp

### Messages

- https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
- https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages

### Media

- https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media
