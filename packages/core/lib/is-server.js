/**
 * @param {any} object
 * @returns {object is import("./index.d.ts").Server}
 */
export function isServer(object) {
  if (!object) return false;
  if (typeof object.listen !== "function") return false;
  const dispatch =
    Object.getOwnPropertyDescriptor(object, "dispatch") ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), "dispatch");
  if (!dispatch) return false;
  if (!dispatch.set && !dispatch.writable) return false;
  return true;
}
