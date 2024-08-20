# @chatally/console

**ChatAlly Console Server** that reads input from the console, dispatches it to a chat application and outputs responses on the console.

You can configure the `displayName`, `prompt`, `greeting`, `goodBye` and the `stopToken` simply by setting these properties. There are also some colors you can configure: `nameColor`, `promptColor` and `responseColor`.

> This package is meant to be used within a [ChatAlly](https://chatally.org) chatbot application.

## Usage

Install the package

```sh
npm install @chatally/console
```

Create a console server and start listening

```js
import { ConsoleServer } from '@chatally/console'

new ConsoleServer(async (req, res) => {
  res.end(`You said: '${req.text}'`)
}).listen()
```

## Documentation

Find the full documentation at https://chatally.org/reference/servers/console.
