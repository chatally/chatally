import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["./lib/index.js"],
  external: ["@chatally/logger"],
  format: "esm",
  noExternal: ["@internal/utils"],
});
