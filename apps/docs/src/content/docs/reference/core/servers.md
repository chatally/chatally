---
title: Servers
sidebar:
  order: 3
---

A chat server receives incoming chat messages and dispatches them to the application.

```typescript
export interface Server extends EventEmitter<ServerEvents> {
  /**  The server's name */
  name: string

  /**
   * The logger to use during runtime. Set this explicitly to false or NoLogger,
   * if the registered server shall not log, otherwise the application will
   * set a child logger during server registration, i.e. in the call to
   * `application.use(server)`.
   *
   * You probably want to implement a setter method, that passes this logger
   * down to child modules, if your server contains any.
   */
  get log(): Logger | undefined
  set log(log: Logger | undefined)

  /**
   * Start the server
   *
   * Called asynchronously (in background) when `listen()` is called on
   * ChatAlly application.
   */
  listen: () => void

  /**
   * Check if media asset belongs to this server
   * @param url URL of media asset
   * @returns true, if the media URL comes from this server
   */
  canDownload: (url: string) => boolean

  /**
   * Download a media asset
   * @param url URL of media asset
   * @returns The binary data of the media asset
   */
  download: (url: string) => Promise<Buffer>
}
```

## Events

A server is a node.js EventEmitter and emits the following event, when a request is dispatched.

```typescript
export interface ServerEvents {
  dispatch: [ChatRequest, ChatResponse]
}
```
