type ItemPropsParams = {
  prune_undefined?: boolean,
  enumerable?: boolean,
};

// for passing as second arg to Object.create()
function item_props<K, V>(
  items: Record<K, V>,
  {
    prune_undefined,
    enumerable = true, // whether for/in loops should find it
  }: ItemPropsParams = {},
) {
  const props: Record<K, { value: V, enumerable: boolean }> = {};

  for (const key in items) {
    const value = items[key];

    if (!skip_undefined || typeof value !== 'undefined') {
      props[key] = {
        value,
        enumerable: true,
      };
    }
  }

  return props;
}


// optimized for reliably fast `insert`
//                             `remove`
//                             `fork`
//               usually fast `contains`
//                            `get`
//               usually ok `enumerate`
//                          `flatten`
//                          `union`
// abuses JS prototype chain, best not dig unless you're into that
// lots of edits will accumulate memory and slow down the usuallys
// consider using `flatten` periodically if long-lived
export default class ProtoChainDictionary<K extends string, V> {
  @tracked
  #leaf: Record<K, V | undefined>;

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
      item_props(items, { enumerable: true }),
    );
  }

  remove(key: K) {
    this.#leaf = Object.create(
      this.#leaf,
      item_props(items, { enumerable: false }),
    );
  }

  fork() {
    return new Dictionary<K, V>({
      fork_from: this,
    });
  }

  contains(key: K): boolean {
    return typeof this.#leaf[key] !== 'undefined';
  }

  get(key: K, default_val?: V) : V | undefined {
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

