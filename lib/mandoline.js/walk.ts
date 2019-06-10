type WalkOptions<K extends string, N, E> = {
  rootward?: boolean;
  already_visited?: KeySet<K>;

  from_each_node?: (this: N) => void;
};

type WalkResult<K extends string> = {
  visited: KeySet<K>;
};

function walk<K, N, E>(
  graph: Graph<K, N, E>,
  root: K | N,
) {
}

interface WaitingArea<T> {
  push(..._: Array<T>): void;
  next(): { done: true } | { value: T };
}

class Queue<T> implements WaitingArea<T> {
  #queue: Array<T> = [];

  push(...t: Array<T>) {
    this.#queue.push(...t);
  }

  next() {
    return this.#queue.length ?
      { value: this.#queue.shift() } :
      { done: true };
  }
}

class Stack<T> implements WaitingArea<T> {
  #stack: Array<T> = [];

  push(...t: Array<T>) {
    this.#stack.push(...t);
  }

  next() {
    return this.#queue.length ?
      { value: this.#queue.pop() } :
      { done: true };
  }
}

class Walker<K extends string, N, E, G extends Graph<K, N, E>> {
  visited: KeySet<K>;
  rootward: boolean = false;

  #graph: G;
  #waiting: WaitingArea<K>;

  next(): K {
    const { value, done } = this.#waiting.next();
    if (done) {
      return {
        done,
        value: {
          visited: this.visited,
        },
      };
    }

    const node = this.#graph.get_node(value);
    this.#waiting.push(
      ...(this.rootward ? node.inward_keys : node.outward_keys),
    );
    return { value };
  }
}

function walk<K extends string, N, E>(
  graph: Graph<K, N, E>,
  start_key: K,
  options: WalkOptions<K, N, E> = {},
) {
  const {
    rootward,
    waiting_area,
  } = options;

  const visited = new KeySet<K>();
  waiting_area.push(start_key);

  visited.add(key);
  yield key;

  const node = graph.get_node(key);
  const next_keys = rootward ? node.inward_keys : node.outward_keys;
  waiting_area.push(...next_keys);
  for (const next_key of next_keys) {
    if (!visited.contains(next_key)) {
      const result = yield* depth_walk(
        graph,
        next_key,
        {
          already_visited: visited,
          rootward,
        },
      );
      visited = result.visited;
    }
  }
  return {
    visited,
  };
}

function* depth_walk<K extends string, N, E>(
  graph: Graph<K, N, E>,
  key: K,
  options: WalkOptions<K, N, E> = {},
) {
  const {
    already_visited,
    rootward,
  } = options;

  let visited = new KeySet<K>({ fork_from: already_visited });

  visited.add(key);
  yield key;

  const node = graph.get_node(key);
  const next_keys = rootward ? node.inward_keys : node.outward_keys;
  for (const next_key of next_keys) {
    if (!visited.contains(next_key)) {
      const result = yield* depth_walk(
        graph,
        next_key,
        {
          already_visited: visited,
          rootward,
        },
      );
      visited = result.visited;
    }
  }
  return {
    visited,
  };
}
