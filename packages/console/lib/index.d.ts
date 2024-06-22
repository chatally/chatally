import { Dispatch, Server } from "@chatally/core";
import { Logger } from "@chatally/logger";

/**
 * Console server class that reads input from the console, dispatches it to a
 * chat application and outputs responses on the console
 * @implements {Server}
 */
export declare class ConsoleServer implements Server {
  /**
   * Create a console server that reads input from the console, dispatches it
   * to a chat application and outputs responses on the console.
   *
   * You can configure the `name`, `prompt`, `greeting`, `goodBye` and the
   * `stopToken` simply by setting these properties. There are also some colors
   * you can configure: `nameColor`, `promptColor` and `responseColor`.
   *
   * @param dispatch [Optional] Dispatch method generating a response. The
   *    default will echo the incoming message.
   */
  constructor(dispatch?: Dispatch);

  name: string;
  set dispatch(d: Dispatch);
  log: boolean | Logger | undefined;
  listen: () => void;
}
