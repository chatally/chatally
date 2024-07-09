import { BaseServer } from '@chatally/core'

/**
 * Console server class that reads input from the console, dispatches it to a
 * chat application and outputs responses on the console.
 */
export declare class ConsoleServer extends BaseServer {
  /**
   * Create a console server that reads input from the console, dispatches it
   * to a chat application and outputs responses on the console.
   *
   * You can configure the `name`, `prompt`, `greeting`, `goodBye` and the
   * `stopToken` simply by setting these properties. There are also some colors
   * you can configure: `nameColor`, `promptColor` and `responseColor`.
   */
  constructor(name?: string)

  listen: () => void
}
