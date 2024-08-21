---
title: Middleware
---

```ts
export type Middleware<D = unknown> =
  | ((params: Context<D>) => unknown)
  | ((params: Context<D>) => Promise<unknown>)
```

## Context

The ChatAlly application gathers an execution context for each middleware module with a request and a response object, which are provided by the server that triggered the handling.

```ts
/**
 * Context used for dispatching to middleware.
 */
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

### ChatRequest

### ChatResponse

### Next

### Media

### Log

The `log` is a context-specific logger for the middleware, that is created as a child logger of the application.

For details, have a look at the [Logger reference documentation](/reference/core/logger)

### Data
