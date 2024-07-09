import type { EventEmitter } from 'node:events'
import type { Logger } from '@chatally/logger'
import type { ChatMessage } from './chat-message.d.ts'
import type { ChatRequest } from './chat-request.d.ts'
import type { ChatResponse } from './chat-response.d.ts'

/**
 * Chat server
 *
 * A chat server receives incoming chat messages and dispatches them to the
 * application.
 */
export interface Server extends EventEmitter<ServerEvents> {
  /**  The server's name */
  name: string

  /**
   * The logger to use during runtime. Set this explicitly to false or NoLogger,
   * if the registered server shall not log, otherwise the application will
   * set a child logger during server registration, i.e. in the call to
   * `application.use(server)`, the application will set a logger.
   *
   * You probably want to implement a setter method, that passes this logger
   * down to child modules, if your server contains any.
   */
  get log(): Logger | undefined
  set log(log: Logger | undefined)

  /**
   * Starts the server.
   *
   * Called asynchronously (in background) when `listen()` is called on
   * ChatAlly application.
   */
  listen: () => void

  canDownload: (url: string) => boolean
  download: (url: string) => Promise<Buffer>
}

export abstract class BaseServer
  extends EventEmitter<ServerEvents>
  implements Server {
  name: string
  get log(): Logger | undefined
  set log(log: Logger | undefined)
  constructor(name: string)
  abstract listen(): void
  /**
   * Dispatch an incoming message to all event listeners on the "dispatch"
   * event.
   *
   * This is a convenience method on EventEmitter.emit("dispatch", req, res).
   *
   * @param incoming Message (string or fully typed)
   * @param callbacks will be registered on the respective response events.
   */
  dispatch(
    incoming: ChatRequest | string,
    callbacks?: {
      onWrite?: (msg: ChatMessage) => void
      onFinished?: (res: ChatResponse) => void
    }
  ): void

  canDownload(url: string): boolean
  download(url: string): Promise<Buffer>
}

export interface ServerEvents {
  dispatch: [ChatRequest, ChatResponse]
}

export function isServer(obj: unknown): obj is Server
