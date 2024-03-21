/** Copyright (c) Christian Fuss */

/**
 * Contact content.
 *
 * https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages#contacts-object
 */
export interface Contact {
  /** Full contact address(es) formatted as an addresses object. */
  addresses?: Addresses[];
  /** YYYY-MM-DD formatted string. */
  birthday?: Birthday;
  /** Contact email address(es) formatted as an emails object. */
  emails?: Email[];
  /** Full contact name formatted as a name object. */
  name: Name;
  /** Contact organization information formatted as an org object. */
  org?: Org;
  /** Contact phone number(s) formatted as a phone object. */
  phones?: Phone[];
  /** Contact URL(s) formatted as a urls object. */
  urls?: URL[];
}

export interface ContactsMessage {
  type: "contacts";
  contacts: Contact[];
}

interface Addresses {
  /** Street number and name. */
  street?: string;
  /** City name. */
  city?: string;
  /** State abbreviation. */
  state?: string;
  /** ZIP code. */
  zip?: string;
  /** Full country name. */
  country?: string;
  /** Two-letter country abbreviation. */
  country_code?: string;
  /** Standard values are HOME and WORK. */
  type?: "HOME" | "WORK" | string;
}

type Birthday =
  `${number}${number}${number}${number}-${number}${number}-${number}${number}`;

interface Email {
  /** Email address. */
  email?: string;
  /** Standard values are HOME and WORK. */
  type?: "HOME" | "WORK" | string;
}

interface Name {
  /** Full name, as it normally appears. */
  formatted_name: string;
  /** First name. */
  first_name?: string;
  /** Last name. */
  last_name?: string;
  /** Middle name. */
  middle_name?: string;
  /** Name suffix. */
  suffix?: string;
  /** Name prefix. */
  prefix?: string;
}

interface Org {
  /** Name of the contact's company. */
  company?: string;
  /** Name of the contact's department. */
  department?: string;
  /** Contact's business title. */
  title?: string;
}

interface Phone {
  /** Automatically populated with the `wa_id` value as a formatted phone number. */
  phone?: string;
  /** Standard Values are CELL, MAIN, IPHONE, HOME, and WORK. */
  type?: "CELL" | "MAIN" | "IPHONE" | "HOME" | "WORK" | string;
  /** WhatsApp ID. */
  wa_id?: string;
}

interface URL {
  /** URL. */
  url?: string;
  /** Standard values are HOME and WORK. */
  type?: "HOME" | "WORK" | string;
}
