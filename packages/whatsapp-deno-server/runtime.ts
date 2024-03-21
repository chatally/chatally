import { runtime } from "./runtime.deno.ts";

/**
 * Runtime wrapper around access to environment variables
 */
export const ENV = {
  /** Get an environment variable */
  get: (key: string) => runtime.envGet(key),

  /** Set an environment variable */
  set: (key: string, value: string | number | boolean | undefined) =>
    runtime.envSet(key, value),

  /** Get a string environment variable */
  string: (key: string) => runtime.envGet(key),

  /** Get a numeric environment variable */
  number: (key: string) => {
    const value = runtime.envGet(key);
    if (value) {
      const num = Number(value);
      if (Number.isNaN(num)) {
        const prefix = `[${new Date().toISOString()}] ERROR utils        |`;
        const message =
          `${prefix} Failed to parse environment variable ${key}=${value} as number`;
        console.log(message);
      }
      return num;
    }
    return undefined;
  },

  /** Get a boolean environment variable */
  boolean: (key: string) => runtime.envGet(key)?.toLowerCase() === "true",
  isProduction: () => {
    const mode = runtime.envGet("MODE")?.toLowerCase();
    return !mode || mode === "production" || mode === "prod";
  },
};

/**
 * Runtime wrapper around HTTP calls (fetch, serve)
 */
export const HTTP = {
  /** Wrapper around web Fetch API, allowing easy initialization */
  fetch: runtime.httpFetch,
};

/**
 * Runtime wrapper around cryptographic functions
 */
export const CRYPTO = {
  /** Sign some data cryptographically using SHA256 algorithm */
  signSha256: runtime.cryptoSignSha256,
};

export const FS = {
  ensureDir: runtime.fsEnsureDir,
  ensureDirSync: runtime.fsEnsureDirSync,
  exists: runtime.fsExists,
  stat: runtime.fsStat,
  readFile: async (file: string) => await runtime.fsReadFile(file),
  readText: async (file: string) => await runtime.fsReadTextFile(file),
  readJson: async (file: string) =>
    JSON.parse(await runtime.fsReadTextFile(file)),
  writeFile: async (file: string, data: Uint8Array, opt?: WriteFileOptions) =>
    await runtime.fsWriteFile(file, data, opt),
  writeText: async (file: string, data: string, options?: WriteFileOptions) =>
    await runtime.fsWriteTextFile(file, data, options),
  writeJson: async (file: string, data: unknown) =>
    await runtime.fsWriteTextFile(file, JSON.stringify(data, null, 2)),
};

/**
 * Runtime wrapper around version information.
 *
 * Should include the name of the runtime, e.g. "Deno" or "node.js"
 */
export const RUNTIME_VERSION = runtime.version;
