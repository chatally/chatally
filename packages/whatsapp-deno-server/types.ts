/** Copyright (c) Christian Fuss */

export interface JsonData {
  [x: string]: JsonValue;
}

type JsonValue =
  | string
  | number
  | boolean
  | Date
  | JsonData
  | JsonValue[]
  | never
  | undefined;

export class SemanticVersion {
  #major: number;
  #minor: number;
  #patch: number;
  #label: SemanticVersionLabel | undefined;

  constructor(
    major: number,
    minor: number,
    patch: number,
    label?: SemanticVersionLabel,
  ) {
    this.#major = major;
    this.#minor = minor;
    this.#patch = patch;
    this.#label = label;
  }

  get major() {
    return this.#major;
  }
  get minor() {
    return this.#minor;
  }
  get patch() {
    return this.#patch;
  }
  get label() {
    return this.#label;
  }

  toString(): string {
    const label = this.#label ? `-${this.#label}` : "";
    return `${this.#major}.${this.#minor}.${this.#patch}${label}`;
  }

  static fromString(version: string): SemanticVersion {
    const [numbers, label] = version.split("-");
    const [major, minor, patch] = numbers.split(".");
    return new SemanticVersion(
      parseInt(major),
      parseInt(minor),
      parseInt(patch),
      label as SemanticVersionLabel,
    );
  }
}

type SemanticVersionLabel = "Alpha" | "Beta" | "RC" | "Release";

/**
 * Code for language or locale.
 *
 * Accepts both language and language_locale formats (e.g., en and en_US).
 * For all codes, see [Supported Languages](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates#supported-languages).
 */
export type LanguageCode = string;

/**
 * Currency code as defined in ISO 4217.
 */
export type CurrencyCode = string;
