// Copyright 2020 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

import type { Logger } from '@chatally/logger';
import { toLogFormat } from './util/errors';
import { explodePromise } from './util/promise';
import { MINUTE } from './util/timeInMilliseconds';
// import { clearTimeoutIfNecessary } from '../util/clearTimeoutIfNecessary';
// import { MINUTE } from '../util/durations';
// import { explodePromise } from '../util/explodePromise';

type TaskType = {
  id: string;
  startedAt: number | undefined;
  suspend(): void;
  resume(): void;
};

const tasks = new Set<TaskType>();
let shouldStartTimers = true;

export function suspendTasksWithTimeout(log?: Logger): void {
  log?.info(`TaskWithTimeout: suspending ${tasks.size} tasks`);
  shouldStartTimers = false;
  for (const task of tasks) {
    task.suspend();
  }
}

export function resumeTasksWithTimeout(log?: Logger): void {
  log?.info(`TaskWithTimeout: resuming ${tasks.size} tasks`);
  shouldStartTimers = true;
  for (const task of tasks) {
    task.resume();
  }
}

export function reportLongRunningTasks(log: Logger): void {
  const now = Date.now();
  for (const task of tasks) {
    if (task.startedAt === undefined) {
      continue;
    }

    const duration = Math.max(0, now - task.startedAt);
    if (duration > MINUTE) {
      log.warn(
        `TaskWithTimeout: ${task.id} has been running for ${duration}ms`
      );
    }
  }
}

export default function createTaskWithTimeout<T, Args extends Array<unknown>>(
  task: (...args: Args) => Promise<T>,
  id: string,
  options: { timeout?: number } = {},
  log?: Logger
): (...args: Args) => Promise<T> {
  const timeout = options.timeout || 30 * MINUTE;

  const timeoutError = new Error(`${id || ''} task did not complete in time.`);

  return async (...args: Args) => {
    let complete = false;

    let timer: NodeJS.Timeout | undefined;

    const { promise: timerPromise, reject } = explodePromise<never>();

    const startTimer = () => {
      stopTimer();

      if (complete) {
        return;
      }

      entry.startedAt = Date.now();
      timer = setTimeout(() => {
        if (complete) {
          log?.warn(
            `TaskWithTimeout: ${id} task timed out, but was already complete`
          );
          return;
        }
        complete = true;
        tasks.delete(entry);

        log?.error(toLogFormat(timeoutError));
        reject(timeoutError);
      }, timeout);
    };

    const stopTimer = () => {
      clearTimeout(timer);
      timer = undefined;
    };

    const entry: TaskType = {
      id,
      startedAt: undefined,
      suspend: () => {
        log?.warn(`TaskWithTimeout: ${id} task suspended`);
        stopTimer();
      },
      resume: () => {
        log?.warn(`TaskWithTimeout: ${id} task resumed`);
        startTimer();
      },
    };

    tasks.add(entry);
    if (shouldStartTimers) {
      startTimer();
    }

    let result: unknown;

    const run = async (): Promise<void> => {
      result = await task(...args);
    };

    try {
      await Promise.race([run(), timerPromise]);

      return result as T;
    } finally {
      complete = true;
      tasks.delete(entry);
      stopTimer();
    }
  };
}
