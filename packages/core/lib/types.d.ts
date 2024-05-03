import { Logger } from "@chatally/logger";

export { Application } from "./application.js";
export { getMessageText } from "./messages.js";

export type Dispatch = (req: Request, res: Response) => Promise<void>;

export type Middleware<D> =
  | ((params: Context<D>) => void | any)
  | ((params: Context<D>) => Promise<void | any>);

export interface Context<D> {
  readonly next: NextFn;
  readonly req: Request;
  readonly res: Response;
  readonly data: D & Record<string, unknown>;
  readonly log: Logger;
}

export type ErrorContext<D> = Omit<Context<D>, "next">;

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

export interface Server {
  name: string;
  set dispatch(d: Dispatch);
  listen(): void;
}
