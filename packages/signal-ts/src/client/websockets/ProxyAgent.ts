// Copyright 2023 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import type { LookupAddress, LookupOptions } from 'dns';
import { lookup } from 'dns/promises';
import type { ProxyAgent } from 'proxy-agent';
import { URL } from 'url';
import { drop } from '../util/drop';
import { SECOND } from '../util/timeInMilliseconds';
import { connectOneSocket } from './HTTPSAgent';

// import * as log from '../logging/log';
// import { happyEyeballs } from './createHTTPSAgent';
// import type { ConnectOptionsType } from './createHTTPSAgent';
// import { explodePromise } from './explodePromise';
// import { SECOND } from './durations';
// import { drop } from './drop';

// Warning threshold
const CONNECT_THRESHOLD = 1 * SECOND;

const SOCKS_PROTOCOLS = new Set([
  'socks:',
  'socks4:',
  'socks4a:',
  'socks5:',
  'socks5h:',
]);

export type { ProxyAgent };

export async function createProxyAgent(proxyUrl: string): Promise<ProxyAgent> {
  const { port, hostname: proxy, protocol } = new URL(proxyUrl);
  const portNumber = getPortNumber(port, protocol);

  const { ProxyAgent } = await import('proxy-agent');
  return new ProxyAgent({
    getProxyForUrl: () => proxyUrl,
    lookup:
      portNumber === undefined
        ? undefined
        : (host, opts, callback) =>
          drop(
            checkedLookupCallback(
              host,
              proxy,
              portNumber,
              opts,
              callback
            )
          ),
  });
}

function getPortNumber(port: string, protocol: string) {
  if (port) {
    return parseInt(port);
  }
  if (protocol === 'http:') {
    return 80;
  }
  if (protocol === 'https:') {
    return 443;
  }
  if (SOCKS_PROTOCOLS.has(protocol)) {
    return 1080;
  }
  return undefined;
}

type CoercedCallbackType = (
  err: NodeJS.ErrnoException | null,
  address: string | Array<LookupAddress>,
  family?: number
) => void;

async function checkedLookupCallback(
  host: string,
  proxy: string,
  port: number,
  opts: LookupOptions,
  callback: CoercedCallbackType
): Promise<void> {
  try {
    const addr = await checkedLookup(host, proxy, port);
    if (opts.all) {
      callback(null, [addr]);
    } else {
      const { address, family } = addr;
      callback(null, address, family);
    }
  } catch (error) {
    callback(error, '', -1);
  }
}

async function checkedLookup(host: string, proxy: string, port: number): Promise<LookupAddress> {
  const addresses = await lookup(host, { all: true });

  // SOCKS 4/5 resolve target host before sending it to the proxy.
  if (host !== proxy) {
    const idx = Math.floor(Math.random() * addresses.length);
    return addresses[idx];
  }

  const socket = await connectOneSocket({ addresses, port });
  const address = socket.address();
  if (!isLookupAddress(address)) {
    throw new Error("socket address is not a LookupAddress");
  }
  // Sadly we can't return socket to proxy-agent
  socket.destroy();

  return address;
}

function isLookupAddress(obj: unknown): obj is LookupAddress {
  const la = obj as LookupAddress;
  return (la.address !== undefined && la.family !== undefined);
}
