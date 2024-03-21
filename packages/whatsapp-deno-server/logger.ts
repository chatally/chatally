/** Copyright (c) Christian Fuss */
import { ENV } from "./runtime.ts";

export enum Level {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
}

const LEVEL_NAMES = [
  "TRACE",
  "DEBUG",
  "INFO ",
  "WARN ",
  "ERROR",
  "FATAL",
];

function name(level: Level): string {
  return LEVEL_NAMES[level];
}

export interface Logger {
  is(level: Level): boolean;
  trace: (...data: unknown[]) => void;
  isTrace: boolean;
  debug: (...data: unknown[]) => void;
  isDebug: boolean;
  info: (...data: unknown[]) => void;
  isInfo: boolean;
  warn: (...data: unknown[]) => void;
  isWarn: boolean;
  error: (...data: unknown[]) => void;
  isError: boolean;
  fatal: (...data: unknown[]) => void;
  isFatal: boolean;
}

export function getLogger(name: string, level?: Level | true): Logger {
  if (level === true) {
    level = Level.DEBUG;
  }
  return new ConsoleLogger(name, level);
}

export abstract class BaseLogger implements Logger {
  #level?: Level;

  constructor(
    protected readonly name: string,
    level?: Level,
  ) {
    this.#level = level;
  }

  #output(level: Level, ...data: unknown[]) {
    if (this.is(level)) this.output(level, ...data);
  }

  protected abstract output(level: Level, ...data: unknown[]): void;

  get level(): Level {
    if (this.#level === undefined) {
      const envLevel = ENV.get("LOG_LEVEL");
      if (!envLevel) {
        return Level.INFO;
      }
      this.#level = Level[envLevel as keyof typeof Level];
    }
    return this.#level;
  }

  set level(level: Level) {
    this.#level = level;
  }

  is(level: Level): boolean {
    return this.level <= level;
  }

  get isTrace() {
    return this.level <= Level.TRACE;
  }

  get isDebug() {
    return this.level <= Level.DEBUG;
  }

  get isInfo() {
    return this.level <= Level.INFO;
  }

  get isWarn() {
    return this.level <= Level.WARN;
  }

  get isError() {
    return this.level <= Level.ERROR;
  }

  get isFatal() {
    return this.level <= Level.FATAL;
  }

  trace(...data: unknown[]) {
    this.#output(Level.TRACE, ...data);
  }

  debug(...data: unknown[]) {
    this.#output(Level.DEBUG, ...data);
  }

  info(...data: unknown[]) {
    this.#output(Level.INFO, ...data);
  }

  warn(...data: unknown[]) {
    this.#output(Level.WARN, ...data);
  }

  error(...data: unknown[]) {
    this.#output(Level.ERROR, ...data);
  }

  fatal(...data: unknown[]) {
    this.#output(Level.FATAL, ...data);
  }
}

export class ConsoleLogger extends BaseLogger {
  protected output(level: Level, ...data: unknown[]) {
    const logger = pad(this.name, 16);
    const prefix = `[${isoDateTime()}] ${name(level)} ${logger} |`;
    console.log.apply(console, [prefix, ...data]);
  }
}

export function pad(input: string, length: number) {
  if (input.length < length) {
    return input + " ".repeat(length - input.length);
  } else {
    return input;
  }
}

export function isoDateTime() {
  return new Date().toISOString();
}
