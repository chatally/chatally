import type { EventEmitter } from 'node:events'
import type { Level, Logger, LoggerOptions } from '@chatally/logger'
import type { ChatRequest } from './chat-request.d.ts'
import type { ChatResponse } from './chat-response.d.ts'
import type { MediaOptions } from './media.js'
import type { Context, Middleware } from './middleware.d.ts'
import type { Server } from './server.d.ts'

/**
 * ChatAlly Application Class
 *
 * Dispatches incoming requests to registered middleware.
 */
export declare class Application<D> extends EventEmitter<ApplicationEvents<D>> {
  /**
   * Create a ChatAlly application that dispatches incoming chat requests from
   * all registered servers to all registered middleware.
   */
  constructor(options?: ApplicationOptions<D>)

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
  use(m: Middleware<D> | Server, name?: string): this

  /**
   * Dispatch request and response to all middlewares.
   *
   * This method is registered as event handler on the servers' "dispatch"
   * event. It decouples handling of incoming messages from the event loop and
   * returns immediately. Register the "write" or "finished" events on the
   * response, if you are interested in the result.
   *
   * The order is the order of registration. Middleware exceptions are
   * dispatched to the context. This method throws only, if the context throws.
   */
  dispatch(req: ChatRequest, res: ChatResponse): Promise<void>

  /**
   * Start all registered servers in parallel.
   *
   * @returns never
   */
  listen(): void

  /**
   * Get a child logger.
   *
   * @param name Name of the child logger
   * @param level [Optional] Log level other than parent level
   * @returns A child logger
   */
  getLogger(name: string, level?: Level): Logger
}

interface ApplicationEvents<D> {
  error: [Error & Record<string, unknown>, Omit<Context<D>, 'next'>]
}

export interface ApplicationOptions<D> {
  /**
   * [Optional] Arbitrary data to put into the context for each request.
   *
   * [`default=undefined`]
   */
  data?: D

  /**
   * [Optional] Custom logger.
   *
   * [`default=new BaseLogger()`]
   * If you want to turn of logging use `NoLogger` or `false`.
   */
  log?: false | LoggerOptions | Logger

  /**
   * [Optional] Flag to run application in development mode.
   *
   * [`default=false`]
   */
  dev?: boolean

  media?: MediaOptions
}
