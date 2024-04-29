import { Logger } from "@chatally/logger";

export interface Application<D extends Object> {
  /**
   * Register an event listener on the application
   *
   * @param event
   * @param listener
   */
  on<E extends keyof ApplicationEvents<D>>(
    event: E,
    listener: ApplicationEvents<D>[E]
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
  get dispatch(): Dispatch;

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
  use(fn: Middleware<D>, name?: string): this;
}

export class Application<D extends Object> {
  constructor(options?: ApplicationOptions<D>);
}

interface ApplicationEvents<D> {
  error: (e: Error & Record<string, unknown>, ctx: ErrorContext<D>) => void;
}

export type ErrorContext<D> = Omit<Context<D>, "next">;

export interface Context<D> {
  readonly next: NextFn;
  readonly req: Request;
  readonly res: Response;
  readonly data: D;
  readonly log: Logger;
}

export type NextFn = () => Promise<void>;

export interface Request {
  readonly message: IncomingMessage;
  readonly text: string;
}

export class Request {
  constructor(message: IncomingMessage | string);
}

export type IncomingMessage = {
  readonly timestamp: number;
  readonly id: string;
  readonly from: string;
  readonly replyTo?: string;
} & MessageContent;

export type MessageContent =
  | {
      readonly type: "text";
      readonly text: string;
    }
  | {
      readonly type: "image";
      readonly image: {
        url: string;
        caption?: string;
      };
    };

export interface Response {
  readonly messages: OutgoingMessage[];
  readonly isWritable: boolean;
  readonly text: string[];
  write(msg: Msg): void;
  end(msg?: Msg): void;
  /**
   * Register an event listener on the application
   *
   * @param event
   * @param listener
   */
  on<E extends keyof ResponseEvents>(
    event: E,
    listener: ResponseEvents[E]
  ): this;
}

export class Response {
  constructor(onFinished?: (res: Response) => void);
}

interface ResponseEvents {
  finished: (res: Response) => void;
  write: (res: Response, msg: OutgoingMessage) => void;
}

export type Msg = OutgoingMessage | OutgoingMessage[] | string;

export type OutgoingMessage = {
  readonly replyTo?: string;
} & MessageContent;

export type Dispatch = (req: Request, res: Response) => Promise<void>;

export type Middleware<D> =
  | ((params: Context<D>) => void | any)
  | ((params: Context<D>) => Promise<void | any>);

export interface ApplicationOptions<D extends Object> {
  dev?: boolean;
  data?: D;
  log?: Logger | boolean;
}

export function getMessageText(msg: MessageContent): string;
