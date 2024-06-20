// Copyright (c) Christian Fuss
interface Runtime {
  /** Version identifier for the runtime */
  version: string;

  /** Sign some data cryptographically using SHA256 algorithm */
  cryptoSignSha256: CryptoSign;

  /** Get an environment variable */
  envGet(key: string): string | undefined;

  /** Set an environment variable */
  envSet(key: string, value: string | number | boolean | undefined): void;

  /** Wrapper around web Fetch API, allowing easy initialization */
  httpFetch: HttpFetch;

  fsEnsureDir(path: string): Promise<void>;
  fsEnsureDirSync(path: string): void;
  fsExists(path: string): Promise<boolean>;
  fsStat(path: string): Promise<FileInfo>;
  fsReadFile(path: string): Promise<Uint8Array>;
  fsReadTextFile(path: string): Promise<string>;
  fsWriteFile(
    path: string,
    content: Uint8Array,
    options?: WriteFileOptions,
  ): Promise<void>;
  fsWriteTextFile(
    path: string,
    content: string,
    options?: WriteFileOptions,
  ): Promise<void>;
}

interface FileInfo {
  /** True if this is info for a regular file. Mutually exclusive to
   * `FileInfo.isDirectory` and `FileInfo.isSymlink`. */
  isFile: boolean;
  /** True if this is info for a regular directory. Mutually exclusive to
   * `FileInfo.isFile` and `FileInfo.isSymlink`. */
  isDirectory: boolean;
  /** True if this is info for a symlink. Mutually exclusive to
   * `FileInfo.isFile` and `FileInfo.isDirectory`. */
  isSymlink: boolean;
  /** The size of the file, in bytes. */
  size: number;
  /** The last modification time of the file. This corresponds to the `mtime`
   * field from `stat` on Linux/Mac OS and `ftLastWriteTime` on Windows. This
   * may not be available on all platforms. */
  mtime: Date | null;
  /** The last access time of the file. This corresponds to the `atime`
   * field from `stat` on Unix and `ftLastAccessTime` on Windows. This may not
   * be available on all platforms. */
  atime: Date | null;
  /** The creation time of the file. This corresponds to the `birthtime`
   * field from `stat` on Mac/BSD and `ftCreationTime` on Windows. This may
   * not be available on all platforms. */
  birthtime: Date | null;
  /** ID of the device containing the file. */
  dev: number;
}

interface WriteFileOptions {
  append?: boolean;
  create?: boolean;
}

type CryptoSign = (data: string, secret: string) => string;

type HttpFetch = (url: string, request?: RequestInit) => Promise<Response>;

type HttpServe = (port: number, handler: HttpHandler) => Promise<void>;

type HttpHandler = (request: Request) => Response | Promise<Response>;
