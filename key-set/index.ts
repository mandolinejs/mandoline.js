type DictionaryOptions<K, V> = {
  entries?: IterableIterator<[K, V]>;
  fork_from?: Dictionary<K, V>;
};

// optimized for fast add, remove, fork, union
// abuses JS prototype chain, best not dig unless you're into that
// lots of edits will accumulate memory over time
// consider using `.flattened()` periodically if long-lived
export class Dictionary<K extends string, V> {
  @tracked
  #leaf: Record<K, V | undefined>;

  constructor({
    fork_from,
    entries,
  }: DictionaryOptions<K, V> = {}) {

    let root_proto_props = undefined;
    if (entries) {
      root_proto_props = entries.reduce(
        (acc, [k, v]) => ({
          ...acc,
          [k]: this.key_property(v),
        }),
        {},
      );
    }

    this.#leaf = Object.create(
      fork_from ? fork_from.#leaf : null,
      root_proto_props,
    );
  }

  static key_property(
    value: V,
  ) {
    return {
      value,
      enumerable: true,
    };
  }

  *keys() {
    for (const key in this.#leaf) {
      if (this.contains(key)) {
        yield key;
      }
    }
  }

  push(key: K, value: V) {
    this.#leaf = Object.create(
      this.#leaf,
      { [key]: this.constructor.key_property(value) },
    );
  }

  get_value(key: K) {
    return this.#leaf[key];
  }

  fork() {
    return new Dictionary<K, V>({
      fork_from: this,
    });
  }

  flattened() {
    return new Dictionary<K, V>({
      entries: this.keys(),
    });
  }
}

type KeySetOptions<K> = {
  keys?: IterableIterator<K>;
  fork_from?: KeySet<K>;
};

export class KeySet<K extends string> extends Dictionary<K, boolean> {
  constructor({
    fork_from,
    keys,
  }: KeySetOptions<K> = {}) {
    if (keys) {
      super({
        fork_from,
        entries: keys.map(k => [k, true]),
      });
    } else {
      super({ fork_from });
    }
  }

  contains(key: K): boolean {
    return Boolean(this.get_value(key));
  }

  add(key: K): void {
    this.push(key, true);
  }

  remove(key: K): void {
    this.push(key, false);
  }

  fork() {
    return new KeySet<K>({
      fork_from: this,
    });
  }

  flattened() {
    return new KeySet<K, V>({
      keys: this.keys(),
    });
  }

  // N: chain length of this
  // M: chain length of other
  // union runs in O(M)
  // fastest for large this, small other
  union(other: KeySet<K, V>) {
    return new KeySet<K, V>({
      fork_from: this,
      keys: other.keys(),
    });
  }
}
