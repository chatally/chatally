/**
 * Dispatch function provided by ChatAlly application.
 * @typedef {((req: import("./request.js").IRequest, res: import("./response.js").IResponse) => Promise<void>) | ((req: import("./request.js").IRequest, res: import("./response.js").IResponse) => void)} Dispatch
 */

/**
 * Chat server
 *
 * A chat server receives incoming chat messages and dispatches them to the
 * application.
 *
 * @typedef {object} Server
 * @property {string} name The server's name
 * @property {Dispatch} dispatch Registers the application as dispatcher
 * @property {() => void} listen Starts the server
 */

/**
 * @param {any} object
 * @returns {object is Server}
 */
export function isServer(object) {
  if (!object) return false;
  if (typeof object.listen !== "function") return false;
  const prop =
    Object.getOwnPropertyDescriptor(object, "dispatch") ||
    Object.getOwnPropertyDescriptor(Object.getPrototypeOf(object), "dispatch");
  if (!prop) return false;
  if (!prop.set && !prop.writable) return false;
  return true;
}
