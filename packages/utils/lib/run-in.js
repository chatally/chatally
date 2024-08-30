/**
 * Run the function in a few seconds.
 * @template R
 * @param {number} seconds delay in seconds
 * @param {() => R|Promise<R>} fn function to run after the delay
 * @returns {Promise<R>} The result from the function
 */
export async function runIn(seconds, fn) {
  await new Promise(resolve => setTimeout(resolve, seconds * 1000))
  return await fn()
}
