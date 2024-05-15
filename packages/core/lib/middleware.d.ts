import type { Logger } from "@chatally/logger";
import type { IRequest } from "./request.js";
import type { IResponse } from "./response.js";

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
