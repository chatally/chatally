import pbjs from "protobufjs-cli/pbjs";
import pbts from "protobufjs-cli/pbts";

const dir = "src/client/protos/";
const protoFile = dir + "*.proto";
const jsFile = dir + "compiled.js";
const dtsFile = dir + "compiled.d.ts";

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

console.log("Generated protocol buffers", { protoFile, jsFile, dtsFile })
