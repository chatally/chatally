export type Message =
  | Audio
  | Buttons
  | Custom
  | Document
  | Image
  | Location
  | Menu
  | Reaction
  | Select
  | Text
  | Video;

export type Action = {
  id: string;
  title: string;
  description?: string;
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
    actions: Action[];
  };
};

export type Custom = {
  readonly type: "custom";
  readonly schema: string;
  readonly custom: any;
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
      actions: Action[];
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

export type Select = {
  readonly type: "select";
  readonly select: Action;
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
