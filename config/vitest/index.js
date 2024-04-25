import { defineConfig as baseConfig } from "vitest/config";

/**
 * @param {import("vitest/config").UserConfig} config
 */
export function defineConfig(config = {}) {
  config.test ??= {};
  config.test.globals ??= true;
  config.test.coverage = { reporter: ["text", "html"] };
  return baseConfig(config);
}

export default defineConfig;
