import { Logger } from "@chatally/logger";

export interface Application<C = {}> {
  /**
   * Register an event listener on the application
   *
   * @param event
   * @param listener
   */
  on<E extends keyof ApplicationEvents>(
    event: E,
    listener: ApplicationEvents[E]
  ): this;

  /**
   * Use the asynchronous callback function to trigger handling of the request
   * by the application.
   *
   * The application will create a fresh context from request and response and
   * pass it to each middleware. The context is responsible for error
   * handling within a callback. The callback will resolve after the last
   * middleware finished.
   */
  get callback(): Callback;
  /**
   * Register a middleware function
   *
   * Middlewares are executed in order of registration, but can `await next()`
   * to wait for the following middlewares to finish.
   *
   * It is preferrable to use a named function over an arrow function, because
   * the name is used to identify child loggers. Optionally, you can provide a
   * name for the middleware.
   * @param fn the middleware
   * @param name optional name
   */
  use(fn: Middleware<C>, name?: string): this;
}

interface ApplicationEvents {
  error: (e: Error) => void;
}

export type Callback = (req: Request, res: Response) => Promise<void>;

export interface Request {
  readonly messages: IncomingMessage[];
}
export interface Response {
  readonly messages: OutgoingMessage[];
  readonly writableFinished: boolean;
  write(msg: OutgoingMessage | OutgoingMessage[]): void;
  end(msg?: OutgoingMessage | OutgoingMessage[]): void;
  error?: ContextError;
}

export type IncomingMessage = string;
export type OutgoingMessage = string;

export type Middleware<C = {}> =
  | ((ctx: Ctx<C>, next: NextFn, log: Logger) => void | any)
  | ((ctx: Ctx<C>, next: NextFn, log: Logger) => Promise<void | any>);

export type Ctx<C = {}> = Context & C;

export interface Context {
  /** Request that triggered the callback */
  readonly req: Request;
  /** Response for this callback */
  readonly res: Response;
  /** Throw an error with context specific information */
  throw(msg: string, opt?: ContextErrorOptions): void;
  /** Conditionally throw an error */
  assert(condition: boolean, msg: string, opt?: ContextErrorOptions): void;
}

export interface ContextErrorOptions {
  expose?: boolean;
  statusCode?: number;
  code?: string;
}

export interface ContextError extends Error, ContextErrorOptions {
  ctx: Context;
}

export type NextFn = () => Promise<void>;

export interface ApplicationOptions<C = {}> {
  dev?: boolean;
  context?: C;
  log?: Logger | boolean;
}

export function createApplication<C = {}>(
  opt?: ApplicationOptions<C>
): Application;
export function createRequest(
  messages: IncomingMessage | IncomingMessage[]
): Request;
export function createResponse(): Response;
