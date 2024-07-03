import type { IncomingMessage } from './message.d.ts'

/**
 * Chat request with incoming message
 */
export declare class Request implements IRequest {
  /**
   * Create a chat request for an incoming message.
   *
   * @param message Fully typed message or a string that can optionally contain
   *    a sender before a colon, i.e. `"<from>: <message>"` will create a text message with properties `from=<from>` and `text="<message>"`.
   */
  constructor (message: string | IncomingMessage)

  get message (): IncomingMessage
  get text (): string
}

/**
 * Chat request with incoming message.
 */
export interface IRequest {
  /** Incoming message */
  get message(): IncomingMessage

  /** Textual content of incoming message */
  get text(): string
}
