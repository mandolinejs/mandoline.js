import {
  AdditiveKeySet as KeySet,
} from './key-set';

// Graphs!
export interface Graph<Key, N, E> {
  readonly nodes: ReadonlyArray<N>;
  readonly edges: ReadonlyArray<E>;
}

export interface GraphNode<Key, N, E> {
  readonly key: Key;
  readonly graph: Graph<Key, N, E>;

  readonly in_edges: ReadonlyArray<E>;
  readonly out_edges: ReadonlyArray<N>;
}

export interface NodeRef<Key, N> {
  readonly key: Key;
  readonly node: N;
}

export interface GraphEdge<Key, N> {
  // parent/child, source/dest, up/down, from/to, yin/yang
  readonly yin: NodeRef<Key, N>;
  readonly yang: NodeRef<Key, N>;
}

// RDAG!
export interface Rdag<
  Key,
  N,
  E,
> extends Graph<Key, N, E> {
  readonly root: NodeRef<Key, N>;
}

export interface RdagNode<
  Key,
  N,
  E,
> extends GraphNode<Key, N, E> {
  readonly root_path: Chain<Key, N, E>;
  readonly root_distance: number;

  readonly rootward_edges: ReadonlyArray<E>;
  readonly rootward_nodes: ReadonlyArray<N>;

  readonly leafward_edges: ReadonlyArray<E>;
  readonly leafward_nodes: ReadonlyArray<N>;
}

export interface RdagEdge<
  Key,
  N,
> extends GraphEdge<Key, N> {
  readonly rootward: NodeRef<Key, N>;
  readonly leafward: NodeRef<Key, N>;
}

// Tree!
// RDAG where each non-root node has exactly one parent
export interface Tree<
  Key,
  N,
  E,
> extends Rdag<Key, N, E> {
}

export interface TreeNode<
  Key,
  N,
  E,
> extends RdagNode<Key, N, E> {
  readonly rootward_edge: E | null;
  readonly rootward_node: N | null;
}

export interface TreeEdge<
  Key,
  N,
> extends RdagEdge<Key, N> {
}

// Pipe!
// RDAG with only one leaf.
// All paths from root eventually lead to the one leaf.
// Sorta the opposite of a Tree.
export interface Pipe<
  Key,
  N,
  E,
> extends Rdag<Key, N, E> {
  readonly root: NodeRef<Key, N>;
  readonly leaf: NodeRef<Key, N>;
}

export interface PipeNode<
  Key,
  N,
  E,
> extends RdagNode<Key, N, E> {
  readonly leaf_distance: number;

  readonly rootward_edge: E | null;
  readonly rootward_node: N | null;

  readonly leafward_edge: E | null;
  readonly leafward_node: N | null;
}

export interface PipeEdge<
  Key,
  N,
> extends RdagEdge<Key, N> {
}

// Chain!
// Pipe in its simplest form: each node has one parent, one child.
// Basically a linked list.
export interface Chain<
  Key,
  N,
  E,
> extends Pipe<Key, N, E> {
}

export interface ChainNode<
  Key,
  N,
  E,
> extends PipeNode<Key, N, E> {
}

export interface ChainEdge<
  Key,
  N,
> extends PipeEdge<Key, N> {
}

// Other things?
export interface HasContents<T> {
  contents: T;
}

class RootedGraph<Key> implements Graph<Key, WebNode, WebEdge> {
  readonly nodes: ReadonlyArray<N>;
  readonly edges: ReadonlyArray<E>;
  readonly root_key: Key;
  readonly root: N;

  constructor(graph: jsnx.DiGraph, root: Key) {

  }
}
