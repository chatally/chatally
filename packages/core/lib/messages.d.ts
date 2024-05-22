export type Message = Text | Image | Audio;

export type Text = {
  readonly type: "text";
  /** The content of the message */
  readonly text: string;
};

export type Image = {
  readonly type: "image";
  readonly image: {
    /** Location of image data */
    url: string;
    /** [Optional] Caption */
    caption?: string;
  };
};

export type Audio = {
  readonly type: "audio";
  readonly audio: {
    /** Location of audio data */
    url: string;
    /** [Optional] transcript of the audio */
    transcript?: string;
  };
};
