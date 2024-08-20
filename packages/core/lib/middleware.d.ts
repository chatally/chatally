import type { Logger } from '@chatally/logger'
import type { ChatRequest } from './chat-request.d.ts'
import type { ChatResponse } from './chat-response.d.ts'
import type { IMediaServer } from './media.js'

/**
 * Sync or async middleware.
 */
export type Middleware<D = unknown> =
  | ((params: Context<D>) => unknown)
  | ((params: Context<D>) => Promise<unknown>)

/**
 * Context used for dispatching to middleware.
 */
export interface Context<D> {
  /** Request that triggered the handling */
  readonly req: ChatRequest
  /** Response for the request */
  readonly res: ChatResponse
  /** Access to media assets */
  readonly media: IMediaServer
  /** Trigger dispatching to the next middleware. */
  readonly next: () => Promise<void>
  /** Context-specific logger for the middleware */
  readonly log: Logger
  /** Arbitrary data storage */
  readonly data: D & Record<string, unknown>
}
