// Copyright 2021 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import { makeEnumParser } from './enum';

// Many places rely on this enum being a string.
export enum Environment {
  Development = 'development',
  Production = 'production',
  Staging = 'staging',
  Test = 'test',
}

let environment: undefined | Environment;
let isMockTestEnvironment: undefined | boolean;

export function getEnvironment(): Environment {
  if (environment === undefined) {
    // This should never happen—we should always have initialized the environment by this
    //   point. It'd be nice to log here but the logger depends on the environment and we
    //   can't have circular dependencies.
    return Environment.Production;
  }
  return environment;
}

/**
 * Sets the current environment. Should be called early in a process's life, and can only
 * be called once.
 *
 * isMockTestEnv is used when running tests that require a non-"test" environment but
 * need to mock certain behaviors.
 */
export function setEnvironment(env: Environment, isMockTestEnv: boolean): void {
  if (environment !== undefined) {
    throw new Error('Environment has already been set');
  }
  environment = env;
  isMockTestEnvironment = isMockTestEnv;
}

export const parseEnvironment = makeEnumParser(
  Environment,
  Environment.Production
);

export const isTestEnvironment = (env: Environment): boolean =>
  env === Environment.Test;

export const isTestOrMockEnvironment = (): boolean => {
  return (
    isTestEnvironment(getEnvironment()) || (isMockTestEnvironment ?? false)
  );
};
