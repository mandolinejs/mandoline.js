import {
  AdditiveKeySet as KeySet,
} from './key-set';

class RootedGraph<Key> implements Graph<Key, WebNode, WebEdge> {
  readonly nodes: ReadonlyArray<N>;
  readonly edges: ReadonlyArray<E>;
  readonly root_key: Key;
  readonly root: N;

  constructor(graph: jsnx.DiGraph, root: Key) {

  }
}
