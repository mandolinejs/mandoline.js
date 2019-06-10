type Boolish = true | false | undefined | null;

export interface KeySet<Key extends string> {
  new(keys?: IterableIterator<Key>);

  contains(key: Key): boolean;
  add(key: Key): void;
  remove(key: Key): void;

  *keys(): IterableIterator<Key>;
  union(other: KeySet<Key>): KeySet<Key>;
}

// TODO: benchmarks -- is one notably faster than the others?

class NativeKeySet<Key extends string> extends KeySet<Key> {
  #set: Set<Key>;

  constructor(keys?: IterableIterator<Key>) {
    this.#set = new Set<Key>(keys);
  }

  contains(key: Key): boolean {
    return this.#set.contains(key);
  }

  add(key: Key): void {
    this.#set.add(key);
  }

  remove(key: Key): void {
    this.#set.remove(key);
  }

  *keys(): IterableIterator<Key> {
    yield* this.#set;
  }
}

class NaiveKeySet<Key extends string> implements KeySet<Key> {
  #set: Record<Key, Boolish>;

  constructor(keys?: IterableIterator<Key>) {
    this.#set = Object.create(null);
  }

  contains(key: Key): boolean {
    return Boolean(this.#set[key]);
  }

  add(key: Key): void {
    this.#set[key] = true;
  }

  remove(key: Key): void {
    this.#set[key] = undefined;
  }
}


type AdditiveKeySetOptions<Key> = {
  keys: IterableIterator<Key>;
  fork_from: AdditiveKeySet<Key>;
};

// uses prototype chain to optimize for fast add, remove, fork, union
// lots of edits will accumulate memory over time
// use `.flattened()` periodically if long-lived
export class ImmutableKeySet<Key extends string> {
  #set: Record<Key, Boolish>;

  constructor(options: AdditiveKeySetOptions<Key> = {}) {
    const { fork_from, keys } = options;

    this.#set = Object.create(
      fork_from ? fork_from.#set : null,
      keys ? key_properties(keys) : undefined,
    );
  }

  static key_property(
    value: boolean = true,
  ) {
    return {
      value,
      enumerable: true,
    };
  }

  static key_properties(
    keys: Array<Key>,
  ) {
    return keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: ImmutableKeySet.key_property(),
      }),
      {},
    );
  }

  contains(key: Key): Boolish {
    return this.#set[key];
  }

  *keys() {
    for (const key in this.#set) {
      if (this.contains(key)) {
        yield key;
      }
    }
  }

  _push_key(key: Key, value: Boolish) {
    return Object.create(
      this.#set,
      { [key]: ImmutableKeySet<Key>.key_property(value) },
    );
  }

  add(key: Key): void {
    this.#set = this._push_key(key, true);
  }

  remove(key: Key): void {
    this.#set = this._push_key(key, false);
  }

  forked(): KeySet<Key> {
    return new AdditiveKeySet<Key>({
      fork_from: this,
    });
  }

  flattened(): KeySet<Key> {
    return new AdditiveKeySet<Key>({
      keys: this.keys(),
    });
  }
}
