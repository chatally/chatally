import { fileURLToPath } from "node:url";
import { basename } from "node:path";

export function LoggerFactory(prefix) {
  return (name) => getLogger(name, prefix);
}

export function getLogger(name, prefix = "") {
  name = resolve(name);
  prefix + name;
}

function resolve(url) {
  try {
    const filename = fileURLToPath(url);
    return basename(filename);
  } catch (err) {
    return basename(url || "???");
  }
}
