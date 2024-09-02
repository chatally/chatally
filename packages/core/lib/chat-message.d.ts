/**
 * Outgoing chat message (part of ChatResponse).
 */
export type ChatMessage =
  | Text
  | Buttons
  | Menu
  | Reaction
  | Location
  | Image
  | Audio
  | Video
  | Document
  | Custom

export type Action = {
  readonly type: 'action'
} & _Action

interface _Action {
  command: string
  title: string
  description?: string
}

export interface Buttons {
  readonly type: 'buttons'
  content: string
  actions: _Action[]
}

export interface Custom {
  readonly type: 'custom'
  readonly schema: string
  readonly custom: unknown
}

export interface Location {
  readonly type: 'location'
  /** Longitude of the location. */
  longitude: number
  /** Latitude of the location. */
  latitude: number
  /** Name of the location. */
  name?: string
  /** Address of the location. */
  address?: string
}

export interface Menu {
  readonly type: 'menu'
  content: string
  title: string
  sections: Array<{
    title?: string
    actions: _Action[]
  }>
}

export interface Reaction {
  readonly type: 'reaction'
  /** The ID of the message the customer reacted to. */
  replyTo: string
  /** The emoji the customer reacted with. */
  emoji: string
}

export interface Text {
  readonly type: 'text'
  /** The content of the message */
  readonly content: string
}

export interface Media {
  /** Location of media data */
  url: string
  /** MIME type */
  mimeType: string
  /** [Optional] Caption */
  caption?: string
}

export interface Image extends Media {
  readonly type: 'image'
  /** [Optional] Image description */
  description?: string
}

export interface Audio extends Media {
  readonly type: 'audio'
  /** [Optional] transcript of the audio */
  transcript?: string
}

export interface Video extends Media {
  readonly type: 'video'
  /** [Optional] transcript of the audio */
  transcript?: string
}

export interface Document extends Media {
  readonly type: 'document'
  /** [Optional] description of the document */
  description?: string
  /** [Optional] Name for the file on the device. */
  filename?: string
}
