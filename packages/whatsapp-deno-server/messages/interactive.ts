/** Copyright (c) Christian Fuss */

import { MessagesError } from "../errors.ts";
import { getLogger } from "../logger.ts";
import { Document, Image, Video } from "./media.ts";

const log = getLogger("messages.interactive");

export type Interactive =
  | InteractiveButton
  | InteractiveList
  | InteractiveProduct
  | InteractiveProductList;

export interface InteractiveMessage {
  type: "interactive";
  interactive: Interactive;
}

/**
 * Reply Button.
 */
export interface InteractiveButton {
  /** The interface of interactive message you want to send. */
  type: "button";
  /** Header content displayed on top of a message. */
  header?: Header;
  /** An object with the footer of the message. */
  footer?: Footer;
  /** An object with the body of the message. */
  body: Body;
  /** */
  action: {
    /** You can have up to 3 buttons. */
    buttons: ReplyButton[];
  };
}

export interface ReplyButton {
  /** only supported interface is reply */
  type: "reply";
  reply: {
    /**
     * Unique identifier for your button.
     *
     * This ID is returned in the webhook when the button is clicked by the
     * user. It cannot have leading or trailing spaces.
     *
     * Maximum length: 256 characters.
     */
    id: string;
    /**
     * Button title.
     *
     * It cannot be an empty string and must be unique within the message.
     * Emojis are supported, markdown is not.
     *
     * Maximum length: 20 characters.
     */
    title: string;
  };
}

export function createInteractiveButton({
  header,
  footer,
  body,
  buttons,
}: {
  header?: Header | string;
  footer?: string;
  body: string;
  buttons: Array<{ title: string; id: string }>;
}) {
  if (header && typeof header === "string" && header.length > 60) {
    header = header.substring(0, 59) + "…";
    log.warn(
      "interactive.header too long, it was truncated to 60 characters:",
      header,
    );
  }
  if (footer && footer.length > 60) {
    footer = footer.substring(0, 59) + "…";
    log.warn(
      "interactive.footer too long, it was truncated to 60 characters:",
      footer,
    );
  }
  if (!body) {
    throw new MessagesError(
      "interactive.body is required for button",
      buttons,
    );
  }
  if (body.length > 1024) {
    body = body.substring(0, 1023) + "…";
    log.warn(
      "interactive.body too long, it was truncated to 1024 characters:",
      body,
    );
  }
  if (buttons.length > 3) {
    throw new MessagesError(
      "interactive.action.buttons too long (max. 3 buttons)",
      buttons,
    );
  }
  for (const button of buttons) {
    if (button.title.length > 20) {
      button.title = button.title.substring(0, 19) + "…";
      log.warn(
        "interactive.action.buttons.reply.title too long, it was truncated to 20 characters:",
        button.title,
      );
    }
    if (button.id.length > 256) {
      throw new MessagesError(
        "interactive.action.buttons.reply.id too long (max. 256 characters)",
        button.id,
      );
    }
  }

  const button: InteractiveButton = {
    type: "button",
    body: {
      text: body,
    },
    action: {
      buttons: buttons.map(({ title, id }) => ({
        type: "reply",
        reply: {
          id,
          title,
        },
      })),
    },
  };
  if (footer) button.footer = { text: footer };
  if (header) {
    button.header = (typeof header === "string")
      ? { type: "text", text: header }
      : header;
  }
  return button;
}

/**
 * List Message.
 */
export interface InteractiveList {
  /** The interface of interactive message you want to send. */
  type: "list";
  /** Header content displayed on top of a message. */
  header?: Header;
  /** An object with the footer of the message. */
  footer?: Footer;
  /** An object with the body of the message. */
  body: Body;
  /** */
  action: {
    /**
     * Button content.
     *
     * It cannot be an empty string and must be unique within the message.
     * Emojis are supported, markdown is not.
     *
     * Maximum length: 20 characters.
     */
    button: string;
    /** Array of section objects. Minimum of 1, maximum of 10. */
    sections: ListSection[];
  };
}

export interface ListSection {
  /** List of rows. You can have a total of 10 rows across your sections. */
  rows: Row[];
  /**
   * Title of the section.
   *
   * Required if the message has more than one section.
   * Maximum length: 24 characters.
   */
  title?: string;
}

export interface Row {
  /** ID (Maximum length: 200 characters) */
  id: string;
  /** Title (Maximum length: 24 characters) */
  title: string;
  /** Description (Maximum length: 72 characters) */
  description?: string;
}

export interface CreateInteractiveListParams {
  header?: Header | string;
  footer?: string;
  body: string;
  button: string;
}

export function createInteractiveList({
  header,
  footer,
  body,
  button,
  rows,
  sections: sections_,
}:
  & CreateInteractiveListParams
  & ({
    rows: Row[];
    sections?: never;
  } | {
    rows?: never;
    sections: ListSection[];
  })) {
  const sections = sections_ ? sections_ : [{ rows }];

  if (header && typeof header === "string" && header.length > 60) {
    header = header.substring(0, 59) + "…";
    log.warn(
      "interactive.header too long, it was truncated to 60 characters:",
      header,
    );
  }
  if (footer && footer.length > 60) {
    footer = footer.substring(0, 59) + "…";
    log.warn(
      "interactive.footer too long, it was truncated to 60 characters:",
      footer,
    );
  }
  if (!body) {
    throw new MessagesError(
      "interactive.body is required for button",
      button,
    );
  }
  if (body.length > 1024) {
    body = body.substring(0, 1023) + "…";
    log.warn(
      "interactive.body too long, it was truncated to 1024 characters:",
      body,
    );
  }
  if (button.length > 20) {
    button = button.substring(0, 19) + "…";
    log.warn(
      "interactive.action.button too long, it was truncated to 20 characters:",
      button,
    );
  }
  if (sections.length < 1) {
    throw new MessagesError(
      "interactive.action.sections is required for list",
      { body, button },
    );
  }
  if (sections.length > 10) {
    throw new MessagesError(
      "interactive.action.sections too long (max. 10 sections)",
      sections,
    );
  }
  if (sections.length > 1) {
    for (const section of sections) {
      if (!section.title) {
        throw new MessagesError(
          "interactive.action.sections.title is required for list with more than one section",
          sections,
        );
      }
    }
  }

  for (const row of sections.flatMap((section) => section.rows)) {
    if (row.title.length > 24) {
      row.title = row.title.substring(0, 23) + "…";
      log.warn(
        "interactive.action.sections.row.title too long, it was truncated to 24 characters:",
        row.title,
      );
    }
    if (row.id.length > 200) {
      throw new MessagesError(
        "interactive.action.sections.row.id too long (max. 200 characters)",
        row.id,
      );
    }
    if (row.description && row.description.length > 72) {
      row.description = row.description.substring(0, 71) + "…";
      log.warn(
        "interactive.action.sections.row.description too long, it was truncated to 72 characters:",
        row.description,
      );
    }
  }

  const list: InteractiveList = {
    type: "list",
    body: {
      text: body,
    },
    action: {
      button,
      sections,
    },
  };
  if (footer) list.footer = { text: footer };
  if (header) {
    list.header = (typeof header === "string")
      ? { type: "text", text: header }
      : header;
  }
  return list;
}

/**
 * Single Product Message.
 */
export interface InteractiveProduct {
  /** The interface of interactive message you want to send. */
  type: "product";
  /** An object with the footer of the message. */
  footer?: Footer;
  /** An object with the body of the message. */
  body?: Body;
  /** */
  action: {
    /**
     * Unique identifier of the Facebook catalog linked to your WABA.
     *
     * This ID can be retrieved via the [Meta Commerce Manager](https://business.facebook.com/commerce_manager/get_started/).
     */
    catalog_id: string;
    /** Unique identifier of the product in a catalog. */
    product_retailer_id: string;
  };
}

/**
 * Multi-Product Message.
 */
export interface InteractiveProductList {
  /** The interface of interactive message you want to send. */
  type: "product_list";
  /** Header content displayed on top of a message. */
  header: Header;
  /** An object with the footer of the message. */
  footer?: Footer;
  /** An object with the body of the message. */
  body: Body;
  /** */
  action: {
    /**
     * Unique identifier of the Facebook catalog linked to your WABA.
     *
     * This ID can be retrieved via the [Meta Commerce Manager](https://business.facebook.com/commerce_manager/get_started/).
     */
    catalog_id: string;
    /** Array of section objects. Minimum of 1, maximum of 10. */
    sections: ProductListSection[];
  };
}

export interface ProductListSection {
  product_items: Array<{
    /**
     * Unique identifier of the product in a catalog.
     *
     * To get this ID, go to the Meta Commerce Manager, select your account and
     * the shop you want to use. Then, click Catalog > Items, and find the item
     * you want to mention. The ID for that item is displayed under the item's
     * name.
     */
    product_retailer_id: string;
  }>;
  /**
   * Title of the section.
   *
   * Required if the message has more than one section.
   * Maximum length: 24 characters.
   */
  title?: string;
}

type Header = DocumentHeader | ImageHeader | TextHeader | VideoHeader;

export interface DocumentHeader {
  type: "document";
  /**
   * Contains the media object for this document.
   */
  document: Document;
}

export interface ImageHeader {
  type: "image";
  /**
   * Contains the media object for this image.
   */
  image: Image;
}

export interface TextHeader {
  type: "text";
  /**
   * Text for the header.
   *
   * Emojis, markdown, and links are supported.
   * Maximum length: 60 characters.
   */
  text: string;
}

export interface VideoHeader {
  type: "video";
  /**
   * Contains the media object for this video.
   */
  video: Video;
}

export interface Footer {
  /**
   * The footer content.
   *
   * Emojis, markdown, and links are supported. Maximum length: 60 characters.
   */
  text: string;
}

export interface Body {
  /**
   * The content of the message.
   *
   * Emojis and markdown are supported. Maximum length: 1024 characters.
   */
  text: string;
}
