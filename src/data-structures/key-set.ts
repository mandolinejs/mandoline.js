import { tracked } from '@glimmer/tracking';

import { Dictionary } from './index';


type KeySetOptions<K> = {
  keys?: IterableIterator<K>;
  fork_from?: KeySet<K>;
};

export class KeySet<K extends string> {
  @tracked
  #dict: Dictionary<K, boolean>;

  constructor({
    fork_from,
    keys,
  }: KeySetOptions<K> = {}) {
    const items = {};
    if (keys) {
      for (const key in keys) {
        items[key] = true;
      }
    }

    this.#dict = new Dictionary<K, boolean>({
      fork_from: fork_from ? fork_from.#dict : undefined,
      items,
    });
  }

  add(key: K): void {
    this.#dict.insert({ [key]: true });
  }

  remove(key: K): void {
    this.#dict.remove(key);
  }

  contains(key: K): boolean {
    return this.#dict.contains(key);
  }

  *enumerate() {
    for (const [key] in this.#dict.enumerate()) {
      yield key;
    }
  }

  fork() {
    return new KeySet<K>({
      fork_from: this,
    });
  }

  flatten() {
    this.#dict.flatten();
  }

  union(other: KeySet<K, V>) {
    return new KeySet<K, V>({
      fork_from: this,
      keys: other.keys(),
    });
  }
}
