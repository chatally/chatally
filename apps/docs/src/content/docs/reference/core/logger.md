---
title: Logger Facade
---

The logger facade is published as separate package [@chatally/logger](https://www.npmjs.com/package/@chatally/logger) on npmjs.com. Find the [sources on Github](https://github.com/chatally/chatally/tree/main/packages/logger).

Install the logger facade by

```sh
npm install @chatally/logger
```

## `Logger`

Logger facade interface. This is the common interface for a simple logger that you can use in your library, that can easily be implemented with any logging framework and does not introduce any dependencies.

### `Logger.level: Level`

Log level of this logger.

### `Logger.name?: string`

Optional name of this logger.

### `Logger.data?: unknown`

Optional data of this logger.

### `Logger.isLevel(level: Level): boolean`

Check if this logger is active on the given level.

### `Logger.child(options?: LoggerOptions): Logger`

Create a child logger. The child logger inherits all properties of the parent logger. Properties can be overwritten by the options. Options can be as follows

```ts
export interface LoggerOptions {
  /** Initial log level of the logger */
  level?: Level
  /** Optional name of the logger */
  name?: string
  /** Additional data to log with each call to a log method */
  data?: unknown
}
```

### Log methods

The logger has log methods according to it's log levels:
`debug(...)`, `info(...)`, `warn(...)`, `error(...)`

All log methods have the same signature:

```ts
(msg: string, ...args: any[]) => unknown; // or
(data: unknown, msg?: string, ...args: any[]) => unknown
```

The message can be a printf-like template, it will be formatted using the rest arguments. The optional data will be logged after the message.

### Default implementations

The package comes with two default implementations.

#### BaseLogger

Basic logger implementation, that logs to the console by default.

This logger is not optimized and should only be used for development. For test purposes, the output can be redirected to any `Writable` by setting the `out` property. Also for test purposes you can turn off the timestamps, by setting the `timestamps` property to false.

```js
const log = new BaseLogger()
log.out = new StringWritable()
log.timestamps = false
```

#### NoLogger

Default implementation of Logger interface with all no-ops.
