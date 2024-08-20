export function fromBase64(data: string): Uint8Array {
  return Buffer.from(data, 'base64');
}

export function toBase64(data: Uint8Array): string {
  return Buffer.from(data).toString('base64');
}

export function fromString(data: string) {
  return Buffer.from(data);
}

export function concatenate(list: ReadonlyArray<Uint8Array>): Uint8Array {
  return Buffer.concat(list);
}

export function toString(data: Uint8Array): string {
  return Buffer.from(data).toString();
}
