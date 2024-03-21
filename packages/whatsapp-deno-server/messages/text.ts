/** Copyright (c) Christian Fuss */

/**
 * Text Object.
 */
export type Text = {
  /**
   * The text of the text message.
   *
   * It can contain URLs which begin with http:// or https:// and formatting.
   * See available formatting options [here](https://developers.facebook.com/docs/whatsapp/on-premises/reference/messages#formatting).
   */
  body: string;

  /**
   * Render a link preview of any URL in the body text string.
   *
   * URLs must begin with http:// or https://. If multiple URLs are in the body
   * text string, only the first URL will be rendered.
   *
   * If preview_url is omitted, or if unable to retrieve a preview, a clickable
   * link will be rendered instead.
   */
  preview_url?: boolean;
};

export interface TextMessage {
  type: "text";
  text: Text;
}
