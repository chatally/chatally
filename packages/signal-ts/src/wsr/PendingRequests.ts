import Long from 'long';

interface SimpleResponse {
  status?: number;
  message?: string;
}

type Resolve<R extends SimpleResponse = SimpleResponse> = (r: R) => void;

export class PendingRequests<O extends SimpleResponse> {
  #nextId = Long.fromNumber(0, true);
  #outgoing = new Map<string, Resolve<O> | undefined>();
  #incoming = new Set<Resolve>();

  get isEmpty() {
    return this.#incoming.size === 0 && this.#outgoing.size === 0;
  }

  addIncoming(resolve?: Resolve) {
    this.#incoming.add(resolve);
  }

  removeIncoming(resolve?: Resolve) {
    this.#incoming.delete(resolve);
  }

  addOutgoing(resolve?: Resolve<O>): Long {
    const id = (this.#nextId = this.#nextId.add(1));
    this.#outgoing.set(id.toString(), resolve);
    return id;
  }

  resolveOutgoing(id: Long, response: O) {
    const resolve = this.#outgoing.get(id.toString());
    if (!resolve) {
      throw new Error(`Response with unknown id: ${id}`);
    }
    resolve(response);
  }

  removeOutgoing(id: Long) {
    this.#outgoing.delete(id.toString());
  }

  closeOutgoing(): void {
    for (const outgoing of this.#outgoing.values()) {
      outgoing({ status: -1, message: 'Connection closed' } as O);
    }
    this.#outgoing.clear();
  }

  closeIncoming(): void {
    for (const incoming of this.#incoming) {
      incoming({ status: -1, message: 'Connection closed' });
    }
    this.#outgoing.clear();
  }
}
