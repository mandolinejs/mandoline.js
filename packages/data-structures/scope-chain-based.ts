const key_set = key_set.push(key_set, key);



  { add, contains },


function push_fn(key: string, val: unknown): string {
  return `
  jj
  `;
}

function scope_api(key: string) {
  return {
    push(key) {

    },
  };
};

const scope_node = `
  function() {
    const ${key} = (${value});
    return {
      push(key) {
      }kkk
`;

type PushResult<K, V> = {
  push: PushFn<K, V>,
  contains: ContainsFn<K>,
};

type PushFn<K, V> = (key: K, value: V) => PushResult<K, V>;
type ContainsFn<K> = (key: K) => boolean;

export default class ScopeChainDictionary<K extends string, V> {
  @tracked #push: PushFn<K, V>;
  @tracked #contains: ContainsFn<K, V>;

  constructor(
    { fork_from, items }: DictionaryParams<K, V> = {},
  ) {
    this.#leaf = Object.create(
      fork_from ? fork_from.#leaf : null,
      items ?
        item_props(items, { prune_undefined: true }) :
        undefined,
    );
  }

  insert(items: Record<K, V | undefined>) {
    this.#leaf = Object.create(
      this.#leaf,
      item_props(items),
    );
  }

  remove(key: K) {
    this.insert({ [key]: undefined });
  }

  fork() {
    return new Dictionary<K, V>({
      fork_from: this,
    });
  }

  contains(key: K): boolean {
    return typeof this.#leaf[key] !== 'undefined';
  }

  retrieve(key: K, default_val?: unknown) : V | undefined {
    const val = this.#leaf[key];
    return typeof val === 'undefined' ? default_val : val;
  }

  *enumerate() {
    // using for/in because it walks the prototype chain
    // unlike Object.entries or its kin
    for (const key in this.#leaf) {
      const value = this.#leaf[key];
      if (typeof value !== 'undefined') {
        yield [key, value];
      }
    }
  }

  // collapses #leaf's prototype chain
  // worth doing before a bunch of expensive ops
  //             periodically on long-lived dicts
  flatten() {
    this.#leaf = Object.create(
      null,
      item_props(this.#leaf, { prune_undefined: true }),
    );
  }

  // fastest for large this, small other
  // slowest for small this, large other
  union(other: Dictionary<K, V>) {
    return new Dictionary<K, V>({
      fork_from: this,
      items: other.#leaf,
    });
  }
}


