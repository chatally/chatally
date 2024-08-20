import { getLogger, type LogWarn } from '@chatally/logger';
import type { Aci } from '@signalapp/libsignal-client';
import { strictAssert } from 'src/util/assert';
import { z } from 'zod';
import { generateUuid, isValidUuid, type UUID } from '../util/uuid';

const $log = getLogger()

export type AciString = UUID;

export function isAciString(value?: string | null): value is AciString {
  return isValidUuid(value);
}

// For tests
export function generateAci(): AciString {
  return generateUuid() as AciString;
}

export function getAciFromPrefix(prefix: string): AciString {
  let padded = prefix;
  while (padded.length < 8) {
    padded += '0';
  }
  return `${padded}-0000-4000-8000-${'0'.repeat(12)}` as AciString;
}

export const aciSchema = z
  .string()
  .refine(isAciString)
  .transform(x => {
    if (!isAciString(x)) {
      throw new Error('Refine did not throw!');
    }
    return x;
  });

export function fromAciObject(obj: Aci): AciString {
  return obj.getServiceIdString() as AciString;
}

export function normalizeAci(
  rawAci: string,
  context: string,
  logger?: LogWarn
): AciString;

export function normalizeAci(
  rawAci: string | undefined | null,
  context: string,
  logger?: LogWarn
): AciString | undefined;

export function normalizeAci(
  rawAci: string | undefined | null,
  context: string,
  logger: LogWarn = $log
): AciString | undefined {
  if (rawAci == null) {
    return undefined;
  }

  const result = rawAci.toLowerCase();
  strictAssert(!result.startsWith('pni:'), 'ACI should not start with PNI:');

  if (!isAciString(result)) {
    logger.warn(
      `Normalizing invalid aci: ${rawAci} to ${result} in context "${context}"`
    );

    // Cast anyway we don't want to throw here
    return result as AciString;
  }

  return result;
}
