---
title: Messages
sidebar:
  order: 6
---

A chat message can have any of these types: [`Text`](./#text), [`Buttons`](./#buttons), [`Menu`](./#menu), [`Reaction`](./#reaction), [`Location`](./#location), [`Image`](./#image), [`Audio`](./#audio), [`Video`](./#video), [`Document`](./#document), [`Custom`](./#custom),

## Text

A simple text message.

```ts
export interface Text {
  readonly type: 'text'
  /** The content of the message */
  readonly content: string
}
```

## Buttons

A message with interactive buttons. The style and constraints for buttons vary for the different servers that are used to deliver the message to the user, e.g. messages on [WhatsApp Cloud](/reference/servers/whatsapp-cloud) can contain a maximum number of 3 buttons, if you have more choices, you have to use a [`Menu`](./#menu).

You can display a normal text message with `content` before the buttons.

A button consists of a technical `command` and a user-visible `title`. Most channels respond with both, when the user pushes one of the buttons, some might just return the `command`.

```ts
export interface Buttons {
  readonly type: 'buttons'
  content: string
  actions: Array<{
    command: string
    title: string
  }>
}
```

## Menu

A message with an interactive list of choices. The choices are usually only displayed after the click on a button. This button can have a `title`.

You can display a normal text message with `content` before this button.

The choices can be grouped into sections.

```ts
export interface Menu {
  readonly type: 'menu'
  content: string
  title: string
  sections: Array<{
    title?: string
    actions: Array<{
      command: string
      title: string
      description?: string
    }>
  }>
}
```

## Reaction

```ts
export interface Reaction {
  readonly type: 'reaction'
  /** The ID of the message the customer reacted to. */
  replyTo: string
  /** The emoji the customer reacted with. */
  emoji: string
}
```

## Location

```ts
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
```

## Media

Media messages usually contain binary data. The message contains only the URL, which you can use together with the [`IMediaServer`](../middleware/#imediaserver) to download the raw data.

```ts
export interface Media {
  /** Location of media data */
  url: string
  /** MIME type */
  mimeType: string
  /** [Optional] Caption */
  caption?: string
}
```

### Image

An image.

```ts
export interface Image extends Media {
  readonly type: 'image'
  /** [Optional] Image description */
  description?: string
}
```

### Audio

An audio message.

```ts
export interface Audio extends Media {
  readonly type: 'audio'
  /** [Optional] transcript of the audio */
  transcript?: string
}
```

### Video

A video message.

```ts
export interface Video extends Media {
  readonly type: 'video'
  /** [Optional] transcript of the audio */
  transcript?: string
}
```

### Document

A proprietary document format, could be an office document, a PDF or any other potentially binary format.

```ts
export interface Document extends Media {
  readonly type: 'document'
  /** [Optional] description of the document */
  description?: string
  /** [Optional] Name for the file on the device. */
  filename?: string
}
```

## Custom

You can use opaque custom messages in your own server implementation.

```ts
export interface Custom {
  readonly type: 'custom'
  readonly schema: string
  readonly custom: unknown
}
```
