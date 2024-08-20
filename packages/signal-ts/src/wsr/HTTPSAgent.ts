// Copyright 2023 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import type { LookupAddress } from 'node:dns';
import type { AgentOptions, RequestOptions } from 'node:https';
import { Agent } from 'node:https';
import net from 'node:net';
import type { ConnectionOptions } from 'node:tls';
import tls from 'node:tls';
import { callbackify } from 'node:util';
import pTimeout from 'p-timeout';

import { noLogger, type Logger } from '@chatally/logger';
import { strictAssert } from '../util/assert';
import { explodePromise } from '../util/promise';
import { sleep } from '../util/sleep';
import { MILLISECONDS, SECONDS } from '../util/timeInMilliseconds';
import { interleaveAddresses, lookup } from './dns';

// https://www.rfc-editor.org/rfc/rfc8305#section-8 recommends 250ms, but since
// we also try to establish a TLS session - use higher value.
const DELAY = 500 * MILLISECONDS;
const CONNECT_TIMEOUT = 10 * SECONDS;

export class HTTPSAgent extends Agent {
  private readonly log: Logger;

  constructor(options: AgentOptions = {}, log = noLogger) {
    super({
      ...options,
      lookup: callbackify(lookup)
    });
    this.log = log;
  }

  public createConnection = callbackify(
    async (options: RequestOptions): Promise<net.Socket> => {
      const { hostname, port } = options;
      strictAssert(hostname, 'Agent.createConnection: Missing options.host');
      strictAssert(port, 'Agent.createConnection: Missing options.port');

      const addresses = await lookup(hostname, {});
      const socket = await connectOneSocket({
        addresses,
        port,
        tlsOptions: {
          ca: options.ca,
          servername: options.servername ?? options.host,
        },
      });

      this.log.info(
        `createConnection(${hostname}): connected to ${socket.address}`
      );

      return socket;
    }
  );
}

type LookupOptions = Readonly<{
  addresses: ReadonlyArray<LookupAddress>;
  port?: string | number;
  tlsOptions?: ConnectionOptions;
}>;

export async function connectOneSocket({
  addresses,
  port = 443,
  tlsOptions,
}: LookupOptions): Promise<net.Socket> {
  if (typeof port === "string") {
    port = Number.parseInt(port)
    if (Number.isNaN(port)) {
      throw new Error(`Socket port '${port}' is not a number.`)
    }
  }
  const interleaved = interleaveAddresses(addresses);
  const abortControllers = interleaved.map(() => new AbortController());

  const results = await Promise.allSettled(
    interleaved.map(async ({ address, family }, index) => {
      const abortController = abortControllers[index];
      if (index !== 0) {
        await sleep(index * DELAY, abortController.signal);
      }

      const socket = await pTimeout(
        connectSocket(
          port as number,
          address,
          tlsOptions,
        ),
        {
          milliseconds: CONNECT_TIMEOUT,
          message: 'createHTTPSAgent.connect: connection timed out'
        }
      );

      if (abortController.signal.aborted) {
        throw new Error('Aborted');
      }

      // Abort other connection attempts
      for (const otherController of abortControllers) {
        if (otherController !== abortController) {
          otherController.abort();
        }
      }
      return { socket, abortController, index };
    })
  );

  const fulfilled = results.find(({ status }) => status === 'fulfilled');
  if (fulfilled) {
    strictAssert(
      fulfilled.status === 'fulfilled',
      'Fulfilled promise was not fulfilled'
    );
    return fulfilled.value.socket;
  }

  strictAssert(
    results[0].status === 'rejected',
    'No fulfilled promises, but no rejected either'
  );

  // Abort all connection attempts for consistency
  for (const controller of abortControllers) {
    controller.abort();
  }
  throw results[0].reason;
}

export async function connectSocket(
  port: number,
  host?: string,
  tlsOptions?: ConnectionOptions,
): Promise<net.Socket> {
  const socket = tlsOptions
    ? tls.connect(port, host, tlsOptions)
    : net.connect(port, host);
  const { promise: connection, resolve, reject } = explodePromise<void>();

  const connectEvent = tlsOptions ? "secureConnect" : "connect";
  socket.once(connectEvent, resolve);
  socket.once('error', reject);

  try {
    await connection;
  } finally {
    socket.removeListener(connectEvent, resolve);
    socket.removeListener('error', reject);
  }

  return socket;
}
