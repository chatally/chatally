// Copyright 2023 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { getLogger, type LogWarn } from '@chatally/logger';
import type { ServiceId } from '@signalapp/libsignal-client';
import { z } from 'zod';
import { isAciString, type AciString } from './AciString';
import { isPniString, type PniString } from './PniString';

const $log = getLogger()

export enum ServiceIdKind {
  ACI = 'ACI',
  PNI = 'PNI',
  Unknown = 'Unknown',
}

export type ServiceIdString = PniString | AciString;

export function isServiceIdString(
  value?: string | null
): value is ServiceIdString {
  return isPniString(value) || isAciString(value);
}

const INVALID_SERVICE_ID_PATTERN = /^.*(.{3})/;

function redactInvalidServiceId(input: string): string {
  return input.replace(INVALID_SERVICE_ID_PATTERN, '[REDACTED]$1');
}

export function normalizeServiceId(
  rawServiceId: string,
  context: string,
  log?: LogWarn
): ServiceIdString;

export function normalizeServiceId(
  rawServiceId: string | undefined | null,
  context: string,
  log?: LogWarn
): ServiceIdString | undefined;

export function normalizeServiceId(
  rawServiceId: string | undefined | null,
  context: string,
  log: LogWarn = $log
): ServiceIdString | undefined {
  if (rawServiceId == null) {
    return undefined;
  }

  const result = rawServiceId.toLowerCase().replace(/^pni:/, 'PNI:');

  if (!isAciString(result) && !isPniString(result)) {
    const before = redactInvalidServiceId(rawServiceId);
    const after = redactInvalidServiceId(result);
    log.warn(
      `Normalizing invalid serviceId: ${before} to ${after} in context "${context}"`
    );
  }
  return result as ServiceIdString;
}


export const serviceIdSchema = z
  .string()
  .refine(isServiceIdString)
  .transform(x => {
    if (!isServiceIdString(x)) {
      throw new Error('Refine did not throw!');
    }
    return x;
  });

// Note: getServiceIdString() returns normalized string so we can cast it
//   without normalizing.
export function fromServiceIdObject(obj: ServiceId): ServiceIdString {
  return obj.getServiceIdString() as ServiceIdString;
}

