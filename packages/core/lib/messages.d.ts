export type Message = Text | Image;

export type Text = {
  readonly type: "text";
  readonly text: string;
};

export type Image = {
  readonly type: "image";
  readonly image: {
    url: string;
    caption?: string;
  };
};
