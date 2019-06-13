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

type Boolish = boolean | undefined;

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
