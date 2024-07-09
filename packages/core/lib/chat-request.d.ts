import type {
  Action,
  Audio,
  Custom,
  Document,
  Image,
  Location,
  Reaction,
  Text,
  Video,
} from './chat-message.js'

/**
 * Chat request with incoming message.
 */
export type ChatRequest = {
  /** Arrival time of message */
  readonly timestamp: number
  /** Id of message */
  readonly id: string
  /** Id of sender */
  readonly from: string
  /** Source of the request, i.e. name of the server */
  readonly source: string
  /** [Optional] Id of message that this message is a reply to. */
  readonly replyTo?: string
} & (
  | Text
  | Action
  | Reaction
  | Location
  | Image
  | Audio
  | Video
  | Document
  | Custom
  )
