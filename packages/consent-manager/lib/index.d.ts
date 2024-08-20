import type { ChatMessage, Middleware } from '@chatally/core'

export interface Options {
  /** Path to the database file */
  path: string
  /**
   * Message to ask for consent.
   *
   * If you use a button message, make sure that the first button is the accept
   * button or define the acceptCommand
   */
  askForConsent: string | ChatMessage
  /** Command id for acceptance, default "accept" */
  acceptCommand: string
  /** Regular expression for acceptance, default "/I accept/i" */
  acceptRegExp: RegExp
  /** Message to thank for consent */
  thankForConsent: string | ChatMessage
}

/**
 * Create a ChatAlly middleware function for GDPR consent management
 *
 * @constructor
 * @param config
 */
export declare const ConsentManager: new (config?: Partial<Options>) => Middleware
