---
title: Application
sidebar:
  order: 3
---

The application receives requests and dispatches them to all middleware. It provides error handling and logging.

Instantiate an [`Application`](/reference/core/application), configure it by registering your server(s) and middleware.

```js
new Application({ log: false }) //
  .use(new ConsoleServer('ChatAlly'))
  .use(({ req, res }) => {
    if (res.isWritable) {
      res.write(`You said '${content(req)}'`)
    }
  })
  .listen()
```

## `constructor`

```typescript
constructor(options?: ApplicationOptions<D>)
```

Create a ChatAlly application that dispatches incoming chat requests from all registered servers to all registered middleware.

```typescript
export interface ApplicationOptions<D> {
  /**
   * [Optional] Arbitrary data to put into the context for each request.
   *
   * [`default=undefined`]
   */
  data?: D

  /**
   * [Optional] Custom logger.
   *
   * [`default=new BaseLogger()`]
   * If you want to turn of logging use `NoLogger` or `false`.
   */
  log?: false | LoggerOptions | Logger

  /**
   * [Optional] Flag to run application in development mode.
   *
   * [`default=false`]
   */
  dev?: boolean

  media?: MediaOptions
}
```

## `use`: Register a [Middleware](/reference/core/middleware) or a [Server](/reference/core/server)

```typescript
use(m: Middleware<D> | Server, name?: string): this
```

Middlewares are executed in order of registration, but can `await next()` to wait for the following middlewares to finish. It is preferrable to use a named function over an arrow function, because the name is used to identify child loggers. Optionally, you can provide a name for the middleware.

This method returns `this`, so you can chain calls to it.

## `dispatch`: Dispatch request and response to all middlewares

```typescript
dispatch(req: ChatRequest, res: ChatResponse): Promise<void>
```

This method is registered as event handler on the servers' "dispatch" event. It decouples handling of incoming messages from the event loop and returns immediately. Register the "write" or "finished" events on the response, if you are interested in the result.

The order is the order of registration. Middleware exceptions are dispatched to the context. This method throws only, if the context throws.

## `listen`: Start all registered servers in parallel

```typescript
listen(): void
```

## `getLogger`: Get a child logger

```typescript
getLogger(name: string, level?: Level): Logger
```

## Events

The application is a node.js EventEmitter and emits the following event in case of an error.

```typescript
interface ApplicationEvents<D> {
  error: [Error & Record<string, unknown>, Omit<Context<D>, 'next'>]
}
```

I.e., as listener you will receive the error (potentially with some extra data) and the context (without the `next()` method).
