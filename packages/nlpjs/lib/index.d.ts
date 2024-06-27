import type { Middleware } from "@chatally/core";
import type { Logger } from "@chatally/logger";
import type { Configuration, Nlp } from "@nlpjs/basic";

/**
 * Create a trained nlp.js NLP (Natural Language Processing) module.
 *
 * It is best practice to provide your NLP configuration as file 'conf.json' in
 * your current working directory.
 *
 * For examples see
 * https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/03.config
 *
 * @param logger [Optional] Integrate it with your ChatAlly application by
 *    passing in an application logger.
 * @param configuration [Optional] Provide a configuration object
 *    programmatically or an array of strings with path names pointing to your
 *    training corpora.
 * @returns The trained NLP module
 */
export declare function trainNlp(
  logger?: Logger,
  configuration?: Configuration | string[]
): Promise<Nlp>;

/**
 * Create a trained nlp.js NLP (Natural Language Processing) module.
 *
 * It is best practice to provide your NLP configuration as file 'conf.json' in
 * your current working directory.
 *
 * For examples see
 * https://github.com/jesus-seijas-sp/nlpjs-examples/tree/master/01.quickstart/03.config
 *
 * @param configuration [Optional] Provide a configuration object
 * programmatically or an array of strings with path names pointing to your
 * training corpora.
 * @returns The trained NLP module
 */
export declare function trainNlp(
  configuration?: Configuration | string[]
): Promise<Nlp>;

/**
 * Create a ChatAlly middleware function for an nlp.js NLP module
 *
 * It will write the answer to the response only, if it is above the configured
 * threshold. It will not end the response.
 *
 * @param nlp The trained NLP module
 * @param options Options
 * @returns a ChatAlly middleware function
 */
export function nlpjsMiddleware(
  nlp: Nlp,
  options?: Options
): Middleware<unknown>;

interface Options {
  /**
   * [Optional] Name for the middleware [`default="nlp.js"`]
   * NOTE: Result data from the NLP process will be put into the context under
   *    this name.
   */
  name?: string;
  /**
   * [Optional] Indicates, whether an answer above the threshold should end the
   * response.
   * [`default=false`]
   */
  end?: boolean;
}
