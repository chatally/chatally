# @chatally/logger

## ChatAlly Logger Facade

Simple logger facade that can be used in libraries to use any logging framework without introducing any dependencies.

The facade can be easily implemented with popular frameworks like [Pino](https://github.com/pinojs/pino), [Winston](https://github.com/winstonjs/winston) or [log4js](https://log4js-node.github.io/log4js-node/).

The main interface of the facade is `Logger`, it supports typical log methods (debug, info, warn, error), logging of messages, format strings and data objects including errors, and creating named child loggers.

## Getting started

Install the package

```sh
npm install @chatally/logger
```

Use the logger

```js
// index.js
import { BaseLogger } from '@chatally/logger'

const log = BaseLogger.create({ name: 'Test' })
log.debug('Not logged') // not logged, because default level is info
log.info('Hello, world!')
```

## Documentation

Find the full documentation at https://chatally.org/reference/core/logger/.
