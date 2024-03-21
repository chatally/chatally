import { ENV } from "../runtime.ts";

/**
 * The directory where the handler logs are stored.
 */
export const WA_HANDLER_LOG_DIR = ENV.get("WA_HANDLER_LOG_DIR");

export class HandlerConfig {
  static get logDir(): string {
    return ENV.get("WA_HANDLER_LOG_DIR") || "/var/log/whatsapp";
  }

  static set logDir(dir: string | undefined) {
    ENV.set("WA_HANDLER_LOG_DIR", dir);
  }

  static get assetsDir(): string {
    return ENV.get("WA_HANDLER_ASSETS_DIR") || "/var/whatsapp";
  }

  static set assetsDir(dir: string | undefined) {
    ENV.set("WA_HANDLER_ASSETS_DIR", dir);
  }
}
