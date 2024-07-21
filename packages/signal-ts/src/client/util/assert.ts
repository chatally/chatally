import type { Logger } from '@chatally/logger';
import { Environment, getEnvironment } from '../environment';
import { toLogFormat } from './errors';
import { stringify } from './stringify';

/**
 * Asserts an expression is true.
 *
 * @param value - An expression to assert is true.
 * @param message - An optional message for the assertion error thrown.
 */
export function strictAssert(value: boolean, message: string): asserts value;

/**
 * Asserts a nullable value is non-null.
 *
 * @param value - A nullable value to assert is non-null.
 * @param message - An optional message for the assertion error thrown.
 */
export function strictAssert<T>(
  value: T | null | undefined,
  message: string
): asserts value is T;

export function strictAssert(condition: unknown, message: string): void {
  if (condition === false || condition == null) {
    throw new Error(message);
  }
}

// `missingCaseError` is useful for compile-time checking that all `case`s in
// a `switch` statement have been handled, e.g.
//
// type AttachmentType = 'media' | 'documents';
//
// const type: AttachmentType = selectedTab;
// switch (type) {
//   case 'media':
//     return <MediaGridItem/>;
//   case 'documents':
//     return <DocumentListItem/>;
//   default:
//     return missingCaseError(type);
// }
//
// If we extended `AttachmentType` to `'media' | 'documents' | 'links'` the code
// above would trigger a compiler error stating that `'links'` has not been
// handled by our `switch` / `case` statement which is useful for code
// maintenance and system evolution.
export function missingCaseError(x: never): never {
  throw new TypeError(`Unhandled case: ${stringify(x)}`);
}

/**
 * In production, logs an error and continues. In all other environments, throws an error.
 */
export function assertDev(
  condition: unknown,
  message: string,
  log: Logger
): asserts condition {
  if (!condition) {
    const err = new Error(message);
    if (getEnvironment() !== Environment.Production) {
      if (getEnvironment() === Environment.Development) {
        debugger; // eslint-disable-line no-debugger
      }
      throw err;
    }
    log.error('assert failure:', toLogFormat(err));
  }
}
