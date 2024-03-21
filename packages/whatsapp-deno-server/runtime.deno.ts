// Copyright (c) Christian Fuss
/// <reference types="./runtime.d.ts" />
import crypto from "node:crypto";

if (
  !Deno.env.get("NO_DOTENV") ||
  Deno.env.get("NO_DOTENV")?.toLowerCase() === "false"
) {
  const { loadSync } = await import(
    "https://deno.land/std@0.184.0/dotenv/mod.ts"
  );
  loadSync({ export: true, allowEmptyValues: true });
}

/**
 * Deno runtime implementation.
 */
export const runtime: Runtime = {
  version: `Deno ${Deno.version.deno}`,

  cryptoSignSha256,

  envGet,
  envSet,

  httpFetch: fetch,

  fsEnsureDir,
  fsEnsureDirSync,
  fsExists,
  fsStat: Deno.stat,
  fsReadFile: Deno.readFile,
  fsReadTextFile: Deno.readTextFile,
  fsWriteFile: Deno.writeFile,
  fsWriteTextFile: Deno.writeTextFile,
};

function cryptoSignSha256(data: string, secret: string): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest("hex");
}

function envGet(key: string): string | undefined {
  return Deno.env.get(key);
}

function envSet(
  key: string,
  value: string | number | boolean | undefined,
): void {
  if (value === undefined) {
    Deno.env.delete(key);
  } else {
    Deno.env.set(key, `${value}`);
  }
}

async function fsEnsureDir(path: string): Promise<void> {
  try {
    await Deno.mkdir(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }
}

function fsEnsureDirSync(path: string): void {
  try {
    Deno.mkdirSync(path, { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.AlreadyExists)) {
      throw error;
    }
  }
}

async function fsExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return false;
    } else {
      throw error;
    }
  }
}
