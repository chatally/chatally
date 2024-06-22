import type { Level, Logger } from "@chatally/logger";
import { EventEmitter } from "node:events";
import type { Message } from "./messages.d.ts";
export type * from "./messages.d.ts";

/**
 * ChatAlly Application Class
 *
 * Dispatches incoming requests to registered middleware.
 */
export declare class Application<
  D extends Record<string, unknown>,
> extends EventEmitter<ApplicationEvents<D>> {
  /**
   * Create a Chatally application that dispatches incoming chat requests from
   * all registered servers to all registered middleware.
   */
  constructor(options?: ApplicationOptions<D>);

  /**
   * Register a Middleware or a Server
   *
   * Middlewares are executed in order of registration, but can `await next()`
   * to wait for the following middlewares to finish.
   *
   * It is preferrable to use a named function over an arrow function, because
   * the name is used to identify child loggers. Optionally, you can provide a
   * name for the middleware.
   *
   * @param m Middleware or server.
   * @param name [Optional] Name for the registered module.
   * @returns `this`
   */
  use(m: Middleware<D> | Server, name?: string): this;

  /**
   * Start all registered servers in parallel.
   *
   * @returns never
   */
  listen(): void;

  /**
   * Asynchronous Method to Trigger Request Handling
   *
   * The application will pass request and response as context to each
   * middleware. The application will handle all uncaught errors within a
   * callback. The callback will resolve after the last middleware finished,
   * but a server could send responses earlier, by registering the
   * `on("finish")` event on the response.
   *
   * @returns a bound dispatch method
   */
  get dispatch(): Dispatch;

  /**
   * Get a child logger.
   *
   * @param name Name of the child logger
   * @param level [Optional] Log level other than parent level
   * @returns A child logger
   */
  getLogger(name: string, level?: Level): Logger;
}

type ApplicationEvents<D> = {
  error: [Error & Record<string, unknown>, Omit<Context<D>, "next">];
};

export interface ApplicationOptions<D> {
  /**
   * [Optional] Arbitrary data to put into the context for each request
   * [`default=undefined`]
   */
  data?: D;
  /**
   * [Optional] Custom logger or flag if you want to use a default logger
   * [`default=new BaseLogger()`]
   */
  log?: Logger | boolean;
  /**
   * [Optional] Flag to run application in development mode
   * [`default=false`]
   */
  dev?: boolean;
}

/**
 * Sync or async middleware.
 */
export type Middleware<D> =
  | ((params: Context<D>) => void | unknown)
  | ((params: Context<D>) => Promise<void | unknown>);

export interface Context<D> {
  /** Request that triggered the handling */
  readonly req: IRequest;
  /** Response for the request */
  readonly res: IResponse;
  /** Trigger dispatching to the next middleware. */
  readonly next: () => Promise<void>;
  /** Context-specific logger for the middleware */
  readonly log: Logger;
  /** Arbitrary data storage */
  readonly data: D & Record<string, unknown>;
}

/**
 * Dispatch function provided by ChatAlly application.
 */
export type Dispatch =
  | ((req: IRequest, res: IResponse) => Promise<void>)
  | ((req: IRequest, res: IResponse) => void);

/**
 * Chat server
 *
 * A chat server receives incoming chat messages and dispatches them to the
 * application.
 */
export interface Server {
  /**  The server's name */
  name: string;
  /** Registers the application as dispatcher */
  set dispatch(d: Dispatch);
  /**
   * The logger to use during runtime. Set this explicitly to false or NoLogger,
   * if the registered server shall not log, otherwise the application will
   * register a child logger.
   */
  log: Logger | boolean | undefined;
  /** Starts the server */
  listen: () => void;
}

/**
 * Chat request with incoming message
 */
export declare class Request implements IRequest {
  /**
   * Create a chat request for an incoming message.
   *
   * @param message Fully typed message or a string that can optionally contain
   *    a "sender:" before a colon
   */
  constructor(message: string | IncomingMessage);

  get message(): IncomingMessage;
  get text(): string;
}

/**
 * Chat request with incoming message.
 */
export interface IRequest {
  /** Incoming message */
  readonly message: IncomingMessage;
  /** Textual content of incoming message */
  readonly text: string;
}

/**
 * Incoming message.
 */
export type IncomingMessage = Message & {
  /** Arrival time of message */
  timestamp: number;
  /** Id of message */
  id: string;
  /** Id of sender */
  from: string;
  /** [Optional] id of message that this message is a reply to */
  replyTo?: string;
};

/**
 * Chat response.
 */
export declare class Response
  extends EventEmitter<ResponseEvents>
  implements IResponse
{
  /**
   * Create a new chat response.
   *
   * @param onFinished
   *   [Optional] Handler to be called, when response `end()` is called.
   */
  constructor(onFinished?: (r: Response) => void);

  messages: OutgoingMessage[];
  isWritable: Readonly<boolean>;
  text: readonly string[];
  write: (msg: string | OutgoingMessage) => void;
  end: (msg?: string | OutgoingMessage | undefined) => void;
}

type ResponseEvents = {
  finished: [Response];
  write: [OutgoingMessage];
};

/**
 * Chat response.
 */
export interface IResponse {
  /** Messages to send as response. */
  messages: OutgoingMessage[];
  /** True if no middleware called end. */
  isWritable: Readonly<boolean>;
  /** Textual representation of all messages. */
  text: Readonly<string[]>;
  /** Write a message. */
  write: (msg: string | OutgoingMessage) => void;
  /** End the response, optionally with a message. */
  end: (msg?: string | OutgoingMessage) => void;
}

/**
 * Incoming message
 */
export type OutgoingMessage = Message & {
  /** [Optional] Id of message that this message is a reply to. */
  replyTo?: string;
};
