import type { ChatMessage } from './chat-message.js'

/**
 * Chat response.
 */
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export interface ChatResponse extends NodeJS.EventEmitter<ChatResponseEvents> {
  /** Messages to send as response. */
  readonly messages: ChatMessage[]
  /** True if no middleware called end. */
  readonly isWritable: Readonly<boolean>
  /** Write a message. */
  write: (msg: string | ChatMessage) => void
  /** End the response, optionally with a message. */
  end: (msg?: string | ChatMessage) => void
}

export interface ChatResponseEvents {
  finished: [ChatResponse]
  write: [ChatMessage]
}

/**
 * Chat response.
 */
// eslint-disable-next-line ts/no-unsafe-declaration-merging
export declare class ChatResponse implements NodeJS.EventEmitter<ChatResponseEvents>, ChatResponse {
  /**
   * Create a new chat response.
   *
   * @param onFinished
   *   [Optional] Handler to be called, when response `end()` is called.
   */
  constructor(onFinished?: (r: ChatResponse) => void)

  readonly messages: ChatMessage[]
  readonly isWritable: Readonly<boolean>
  write: (msg: string | ChatMessage) => void
  end: (msg?: string | ChatMessage | undefined) => void
}
