---
title: Middleware
sidebar:
  order: 4
---

Middleware can be either synchronous or asynchronous.

```typescript
export type Middleware<D = unknown> =
  | ((params: Context<D>) => unknown)
  | ((params: Context<D>) => Promise<unknown>)
```

## `Context`

The ChatAlly application gathers an execution context for each middleware module with a request and a response object, which are provided by the server that triggered the handling.

```ts
export interface Context<D> {
  /** Request that triggered the handling */
  readonly req: ChatRequest
  /** Response for the request */
  readonly res: ChatResponse
  /** Trigger dispatching to the next middleware. */
  readonly next: () => Promise<void>
  /** Access to media assets */
  readonly media: IMediaServer
  /** Context-specific logger for the middleware */
  readonly log: Logger
  /** Arbitrary data storage */
  readonly data: D & Record<string, unknown>
}
```

### `ChatRequest`

Chat request with incoming message, which is combined with a [message type](../messages)

```ts
export type ChatRequest = {
  /** Arrival time of message */
  readonly timestamp: number
  /** Id of message */
  readonly id: string
  /** Id of sender */
  readonly from: string
  /** Source of the request, i.e. name of the server */
  readonly source: string
  /** [Optional] Id of message that this message is a reply to. */
  readonly replyTo?: string
}
```

### `ChatResponse`

```ts
export interface ChatResponse extends NodeJS.EventEmitter<ChatResponseEvents> {
  /** Messages to send as response. */
  readonly messages: ChatMessage[]
  /** True if no middleware called end. */
  readonly isWritable: Readonly<boolean>
  /** Write a message. */
  write: (msg: string | ChatMessage) => void
  /** End the response, optionally with a message. */
  end: (msg?: string | ChatMessage) => void
}
```

### `await next()`

With a call to `await next()`, you can execute parts of your middleware in the downstream leg of the request handling, i.e. after other middleware modules that have been registered after this module, but before the downstream part of middleware modules registered before this module.

### `IMediaServer`

This feature allows to load media assets on demand.

```ts
export interface IMediaServer {
  /**
   * Load a media asset and provide it's raw data as Buffer
   *
   * @param media Media meta-data that contains a URL.
   * @returns The raw data
   */
  load: (media: { url: string }) => Promise<Buffer>
}
```

### `Logger`

The `log` is a context-specific logger for the middleware, that is created as a child logger of the application.

For details, have a look at the [Logger reference documentation](/reference/core/logger)

### `data`

The data can contain arbitrary data. It can be static data, which is added by the application for each request, e.g. a database to access persisted data or a wrapped REST API, which can be accessed on demand. It can also be data, that is added by upstream middleware or downstream middleware after a call to `await next()`.
