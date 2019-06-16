interface KeySet<K> {
  add(key: K): void;
  remove(key: K): void;

  contains(key: K): boolean;
  *enumerate(): IterableIterator<K>;

  fork(): KeySet<K>;
  union(other: KeySet<K>): KeySet<K>;

  flatten(): void;
}

type DictionaryParams<K, V> = {
  items?: Record<K, V>;
  fork_from?: Dictionary<K, V>;
};

interface DictionaryFactory<K, V> {
}

interface Dictionary<K, V> {
  insert(items: Record<K, V | undefined>): void;
  remove(key: K): void;

  contains(key: K): boolean;
  *enumerate(): IterableIterator<[K, V]>;

  fork(): Dictionary<K, V>;
  union(other: Dictionary<K, V>): Dictionary<K, V>;

  flatten(): void;
}

