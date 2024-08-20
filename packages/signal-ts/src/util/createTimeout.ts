export function createTimeout<R>(timeout: number, message?: string) {
  message ??= `Timed out after ${timeout}ms`;
  let rawResolve: (value: R) => void;
  let rawReject: (reason?: any) => void;

  const promise = new Promise<R>((resolve, reject) => {
    rawResolve = resolve;
    rawReject = reject;
  });

  let handleTimeout: () => void | undefined = undefined;
  function onTimeout(handler: () => void) {
    handleTimeout = handler;
  }

  const timer = setTimeout(() => {
    handleTimeout && handleTimeout();
    rawReject(new Error(message));
  }, timeout);
  const resolve = (value: R) => {
    clearTimeout(timer);
    rawResolve(value);
  };
  const reject = (reason?: any) => {
    clearTimeout(timer);
    rawReject(reason);
  };

  return { promise, resolve, reject, onTimeout };
}
