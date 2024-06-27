/**
 * Generic message type (incoming and outgoing).
 */
export type Message = IncomingMessage | OutgoingMessage;

/**
 * Incoming message.
 */
export type IncomingMessage = {
  /** Arrival time of message */
  timestamp: number;
  /** Id of message */
  id: string;
  /** Id of sender */
  from: string;
  /** [Optional] Id of message that this message is a reply to. */
  replyTo?: string;
} & (
  | Action // Incoming only
  | BidiMessage
);

/** Bidirectional message types */
type BidiMessage =
  | Audio
  | Custom
  | Document
  | Image
  | Location
  | Reaction
  | Text
  | Video;

/**
 * Incoming message
 */
export type OutgoingMessage = {
  /** [Optional] Id of message that this message is a reply to. */
  readonly replyTo?: string;
} & (
  | Buttons // Outgoing only
  | Menu // Outgoing only
  | BidiMessage
);

export type Action = {
  readonly type: "action";
  readonly action: _Action;
};

export type Audio = {
  readonly type: "audio";
  readonly audio: {
    /** Location of audio data */
    url: string;
    /** MIME type */
    mimeType: string;
    /** [Optional] Caption */
    caption?: string;
    /** [Optional] transcript of the audio */
    transcript?: string;
  };
};

export type Buttons = {
  readonly type: "buttons";
  /** The content of the message */
  readonly buttons: {
    text: string;
    actions: _Action[];
  };
};

type _Action = {
  id: string;
  title: string;
  description?: string;
};

export type Custom = {
  readonly type: "custom";
  readonly schema: string;
  readonly custom: unknown;
};

export type Document = {
  readonly type: "document";
  readonly document: {
    /** Location of document data */
    url: string;
    /** MIME type */
    mimeType: string;
    /** [Optional] Caption */
    caption?: string;
    /** [Optional] Name for the file on the device. */
    filename?: string;
    /** [Optional] description of the document */
    description?: string;
  };
};

export type Image = {
  readonly type: "image";
  readonly image: {
    /** Location of image data */
    url: string;
    /** MIME type */
    mimeType: string;
    /** [Optional] Caption */
    caption?: string;
    /** [Optional] Image description */
    description?: string;
  };
};

export type Location = {
  readonly type: "location";
  readonly location: {
    /** Longitude of the location. */
    longitude: number;
    /** Latitude of the location. */
    latitude: number;
    /** Name of the location. */
    name?: string;
    /** Address of the location. */
    address?: string;
  };
};

export type Menu = {
  readonly type: "menu";
  /** The content of the message */
  readonly menu: {
    title: string;
    text: string;
    sections: Array<{
      title?: string;
      actions: _Action[];
    }>;
  };
};

export type Reaction = {
  readonly type: "reaction";
  readonly reaction: {
    /** The ID of the message the customer reacted to. */
    replyTo: string;
    /** The emoji the customer reacted with. */
    emoji: string;
  };
};

export type Text = {
  readonly type: "text";
  /** The content of the message */
  readonly text: string;
};

export type Video = {
  readonly type: "video";
  readonly video: {
    /** Location of video data */
    url: string;
    /** MIME type */
    mimeType: string;
    /** [Optional] Caption */
    caption?: string;
    /** [Optional] transcript of the video */
    transcript?: string;
  };
};
