import { GraphApiConfig } from "./graph_api.ts";
import { ENV } from "./runtime.ts";
import { WebhooksConfig } from "./webhooks.types.ts";

export function newGraphApiConfig(
  config?: Partial<GraphApiConfig>,
  readEnv = true,
): GraphApiConfig {
  const envGet = readEnv ? ENV.get : () => undefined;
  const envGetNumber = readEnv ? ENV.number : () => undefined;
  const envGetBoolean = readEnv ? ENV.boolean : () => undefined;

  const id = config?.id || envGet("GRAPH_API_ID") || "";
  const accessToken = //
    config?.accessToken ||
    envGet("GRAPH_API_ACCESS_TOKEN") ||
    "";

  const baseUrl = config?.baseUrl || envGet("GRAPH_API_URL");
  const basePort = config?.basePort || envGetNumber("GRAPH_API_PORT");

  const dryRun = config?.dryRun ?? envGetBoolean("GRAPH_API_DRYRUN");

  return { id, accessToken, baseUrl, basePort, dryRun };
}

export function newWebhooksConfig(
  config?: Partial<WebhooksConfig>,
  readEnv = true,
): WebhooksConfig {
  const envGet = readEnv ? ENV.get : () => undefined;

  const secret = config?.secret || envGet("WHATSAPP_WEBHOOKS_SECRET");
  const verifyToken = config?.verifyToken ||
    envGet("WHATSAPP_WEBHOOKS_VERIFY_TOKEN");
  const isDevelopment = config?.isDevelopment || !ENV.isProduction();

  return { secret, verifyToken, isDevelopment };
}
