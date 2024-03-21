/**
 * Base error class that supports `instanceof` checks also for subclasses
 */
export class BaseError extends Error {
  constructor(message?: string) {
    const proto = new.target.prototype;
    super(message);
    Object.setPrototypeOf(this, proto);
  }
}

export class GraphApiError extends BaseError {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  error_user_title: string;
  error_user_msg: string;
  fbtrace_id: string;

  constructor(init: GraphApiErrorInit) {
    super(init.error_user_msg);
    this.message = init.message;
    this.type = init.type;
    this.code = init.code;
    this.error_subcode = init.error_subcode;
    this.error_user_title = init.error_user_title;
    this.error_user_msg = init.error_user_msg;
    this.fbtrace_id = init.fbtrace_id;
  }
}

export interface GraphApiErrorInit {
  message: string;
  type: string;
  code: number;
  error_subcode: number;
  error_user_title: string;
  error_user_msg: string;
  fbtrace_id: string;
}

export class DryRunError extends BaseError {
  constructor(
    message: string,
    public readonly url: string,
    public readonly request: RequestInit,
  ) {
    super(message);
  }
}

export class MessagesError extends BaseError {
  constructor(message?: string, public readonly info?: unknown) {
    super(message);
  }
}

export class MediaError extends BaseError {
  constructor(message?: string, public readonly info?: unknown) {
    super(message);
  }
}

/**
 * Error class for HTTP errors
 */
export class HttpError extends BaseError {
  constructor(
    public readonly status: number,
    message?: string,
    public readonly description?: string,
  ) {
    super(message);
  }
}
