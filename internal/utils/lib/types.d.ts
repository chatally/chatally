import { Writable, WritableOptions } from "node:stream";

export class StringWritable extends Writable {
  constructor(options?: WritableOptions);
  data: string;
}

export type Prop<O> = [keyof O];

export function only<O extends Object, K = Array<keyof O>>(
  obj: O,
  keys: K
): Partial<O>;

export function getCurrentTime(): string;

export function fileURLtoFileName(url: string): string;
