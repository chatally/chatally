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
  _major: number;
  _minor: number;
  _patch: number;
  _label: SemanticVersionLabel | undefined;

  constructor(
    major: number,
    minor: number,
    patch: number,
    label?: SemanticVersionLabel
  ) {
    this._major = major;
    this._minor = minor;
    this._patch = patch;
    this._label = label;
  }

  get major() {
    return this._major;
  }
  get minor() {
    return this._minor;
  }
  get patch() {
    return this._patch;
  }
  get label() {
    return this._label;
  }

  toString(): string {
    const label = this._label ? `-${this._label}` : "";
    return `${this._major}.${this._minor}.${this._patch}${label}`;
  }

  static fromString(version: string): SemanticVersion {
    const [numbers, label] = version.split("-");
    const [major, minor, patch] = numbers.split(".");
    return new SemanticVersion(
      parseInt(major),
      parseInt(minor),
      parseInt(patch),
      label as SemanticVersionLabel
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
