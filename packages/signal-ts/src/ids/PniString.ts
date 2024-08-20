import { getLogger, type LogWarn } from '@chatally/logger';
import type { Pni } from '@signalapp/libsignal-client';
import { generateUuid, isValidUuid } from 'src/util/uuid';
import { z } from 'zod';

const $log = getLogger()

export type PniString = `PNI:${string}`;
export type UntaggedPniString = string;// & { __untagged_pni: never };


export function isPniString(value?: string | null): value is PniString {
  if (value == null) {
    return false;
  }

  if (value.startsWith('PNI:')) {
    return true;
  }

  return false;
}

export function isUntaggedPniString(
  value?: string | null
): value is UntaggedPniString {
  return isValidUuid(value);
}

export function toTaggedPni(untagged: UntaggedPniString): PniString {
  return `PNI:${untagged}` as PniString;
}

export function toUntaggedPni(pni: PniString): UntaggedPniString {
  return pni.replace(/^PNI:/i, '') as UntaggedPniString;
}

export function normalizePni(
  rawPni: string,
  context: string,
  log?: LogWarn
): PniString;

export function normalizePni(
  rawPni: string | undefined | null,
  context: string,
  log?: LogWarn
): PniString | undefined;

export function normalizePni(
  rawPni: string | undefined | null,
  context: string,
  log: LogWarn = $log
): PniString | undefined {
  if (rawPni == null) {
    return undefined;
  }
  const result = rawPni.toLowerCase().replace(/^pni:/, 'PNI:');
  if (!isPniString(result)) {
    log.warn(
      `Normalizing invalid pni: ${rawPni} to ${result} in context "${context}"`
    );
  }
  return result as PniString;
}

export function generatePni(): PniString {
  return `PNI:${generateUuid()}` as PniString;
}

export const untaggedPniSchema = z
  .string()
  .refine(isUntaggedPniString)
  .transform(x => {
    if (!isUntaggedPniString(x)) {
      throw new Error('Refine did not throw!');
    }
    return x;
  });

export function fromPniObject(obj: Pni): PniString {
  return obj.getServiceIdString() as PniString;
}
