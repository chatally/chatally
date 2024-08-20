# @chatally/logger

**ChatAlly Logger Facade** that can be used in libraries to use any logging framework without introducing any dependencies.

The facade can be easily implemented with popular frameworks like [Pino](https://github.com/pinojs/pino), [Winston](https://github.com/winstonjs/winston) or [log4js](https://log4js-node.github.io/log4js-node/).

The main interface of the facade is `Logger`, it supports typical log methods (trace, debug, info, warn, error), logging of messages, format strings and data objects including errors, and creating named child loggers.

The package contains two default implementations: `BaseLogger` and `NoLogger`.

> This package is meant to be used within a [ChatAlly](https://chatally.org) chatbot application, but could be used anywhere.

## Usage

Install the package

```sh
npm install @chatally/logger
```

Use the logger

```js
// index.js
import { BaseLogger } from '@chatally/logger';

class MyClass {
  /** @param {import('@chatally/logger').Logger} log */
  constructor(log) {
    this.log = log;
  }

  doSomething() {
    this.log.debug("I am about to do something");
    // do something
    this.log.info("Just did something.");
  }
}

const log = new BaseLogger({ name: 'foo' });
const foo = new MyClass(log);
// with the default settings from BaseLogger, it logs
// [<timestamp>] INFO (foo): Just did something.
foo.doSomething(); 
```

## Documentation

Find the full documentation at https://chatally.org/reference/core/logger/.
