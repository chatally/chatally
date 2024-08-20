export class Timer {
  #repeat: NodeJS.Timeout;
  #timeout: NodeJS.Timeout;
  #startTimeout: () => void;

  constructor({ action, interval, timeout, timeoutAction }: Builder) {
    const startRepeat = () => {
      this.#repeat = setTimeout(() => {
        action();
        startRepeat();
      }, interval);
    };
    startRepeat();

    if (timeout) {
      this.#startTimeout = () => {
        this.#timeout = setTimeout(() => {
          clearTimeout(this.#repeat);
          if (timeoutAction) {
            timeoutAction();
          }
        }, timeout);
      };
      this.#startTimeout();
    }
  }

  stop() {
    clearTimeout(this.#repeat);
    if (this.#timeout) {
      clearTimeout(this.#timeout);
    }
  }

  restart() {
    if (this.#startTimeout) {
      this.#startTimeout();
    }
  }

  static execute(action: () => void): Builder {
    return new Builder().execute(action);
  }
}

class Builder {
  action: () => void;
  interval: number;
  timeout: number;
  timeoutAction: () => void;

  execute(action: () => void) {
    this.action = action;
    return this
  }

  every(interval: number) {
    this.interval = interval;
    return this;
  }

  timeoutAfter(timeout: number) {
    this.timeout = timeout;
    return this;
  }

  onTimeout(timeoutAction: () => void) {
    this.timeoutAction = timeoutAction;
    return this;
  }

  start() {
    if (!this.action) {
      throw new Error("No action set for execution.");
    }
    if (!this.interval) {
      throw new Error("No interval set for execution.")
    }
    if (!this.timeout && this.timeoutAction) {
      throw new Error("Timeout action set, but no timeout.")
    }
    return new Timer(this);
  }
}
