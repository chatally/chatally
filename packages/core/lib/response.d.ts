import type { EventEmitter } from "node:events";
import type { OutgoingMessage } from "./message.js";
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
  write: (msg: string | OutgoingMessage) => void;
  end: (msg?: string | OutgoingMessage | undefined) => void;
  get text(): string[];
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
  /** Write a message. */
  write: (msg: string | OutgoingMessage) => void;
  /** End the response, optionally with a message. */
  end: (msg?: string | OutgoingMessage) => void;
  /** Textual content of outgoing messages */
  get text(): string[];
}
