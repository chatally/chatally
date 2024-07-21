import type {
  LookupAddress,
  LookupAllOptions,
  LookupOneOptions
} from 'node:dns';
import { resolve4, resolve6 } from 'node:dns/promises';
import pTimeout from 'p-timeout';
import z from 'zod';
import { SECONDS } from '../util/timeInMilliseconds';

const LOOKUP_TIMEOUT = 5 * SECONDS;

const fallbacks = new Map<string, ReadonlyArray<LookupAddress>>();

export function setFallbacks(entries: LookupFallback[]) {
  for (let { hostname, addresses } of entries) {
    fallbacks.set(hostname, addresses)
  }
}

export async function lookup(
  hostname: string,
  options: LookupOneOptions | LookupAllOptions
): Promise<LookupAddress[]> {
  const { family = 0, all = true } = options;
  const resolve =
    family === 4 || family === "IPv4" ?
      async () => (
        (await resolve4(hostname)).map(address => ({ address, family: 4 }))
      )
      : family === 6 || family === "IPv6" ?
        async () => (
          (await resolve6(hostname)).map(address => ({ address, family: 6 }))
        ) :
        async () => {
          const [ip4, ip6] = await Promise.all([resolve4(hostname), resolve6(hostname)]);
          return [...ip4.map(address => ({ address, family: 4 })), ...ip6.map(address => ({ address, family: 6 }))]
        };
  let resolved: LookupAddress[];
  try {
    resolved = await pTimeout(
      resolve(),
      {
        milliseconds: LOOKUP_TIMEOUT,
        message: 'lookupAll: dns.resolve timed out'
      }
    );
  } catch (error) {
    resolved = fallbacks.get(hostname)?.slice();
    if (!resolved) {
      throw error;
    }
  }
  return resolved;
}

export function interleaveAddresses(
  addresses: ReadonlyArray<LookupAddress>
): Array<LookupAddress> {
  const firstAddr = addresses.find(
    ({ family }) => family === 4 || family === 6
  );
  if (!firstAddr) {
    throw new Error('interleaveAddresses: no addresses to interleave');
  }

  const v4 = addresses.filter(({ family }) => family === 4);
  const v6 = addresses.filter(({ family }) => family === 6);

  // Interleave addresses for Happy Eyeballs, but keep the first address
  // type from the DNS response first in the list.
  const interleaved = new Array<LookupAddress>();
  while (v4.length !== 0 || v6.length !== 0) {
    const v4Entry = v4.pop();
    const v6Entry = v6.pop();

    if (firstAddr.family === 4) {
      if (v4Entry !== undefined) {
        interleaved.push(v4Entry);
      }
      if (v6Entry !== undefined) {
        interleaved.push(v6Entry);
      }
    } else {
      if (v6Entry !== undefined) {
        interleaved.push(v6Entry);
      }
      if (v4Entry !== undefined) {
        interleaved.push(v4Entry);
      }
    }
  }

  return interleaved;
}

export const DNSEndpointSchema = z.array(
  z.object({
    domain: z.string(),
    endpoints: z.array(
      z.object({
        family: z.enum(['ipv4', 'ipv6']),
        address: z.string(),
      })
    ),
  })
);

export interface LookupFallback {
  hostname: string,
  addresses: LookupAddress[]
}
