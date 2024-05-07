import { defineConfig } from "tsup";

export default defineConfig({
  dts: true,
  entry: ["./lib/index.js"],
  format: "esm",
  noExternal: ["@internal/utils"],
});
