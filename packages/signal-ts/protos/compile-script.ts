import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import pbjs from "protobufjs-cli/pbjs";
import pbts from "protobufjs-cli/pbts";

const dir = dirname(new URL(import.meta.url).pathname);
const protoFile = dir + "/*.proto";
const jsFile = dir + "/compiled.js";
const dtsFile = dir + "/compiled.d.ts";

console.log("Generating protocol buffers...", { protoFile, jsFile, dtsFile })

pbjs.main([
  "--target", "static-module",
  "--es6", "--wrap", "es6",
  "--out", jsFile,
  protoFile
]);

pbts.main([
  "--out", dtsFile,
  jsFile
])

console.log("Tweaking output...");
writeFileSync(
  jsFile,
  readFileSync(jsFile, "utf8")
    .replace("import * as $protobuf ", "import $protobuf "),
  "utf8"
);

console.log("Done.")