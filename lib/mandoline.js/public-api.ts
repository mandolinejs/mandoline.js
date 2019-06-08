import { Rdag } from './rdag/public-api';

type Graph = unknown;

export type RdagSliceParams<T, Key> = {
  nodes: Array<Key>,
  edges: Array<[Key, Key]>,
} | {
  depth: number;
};

export type TreeSliceParams<T, Key> = {
};

export type ChainSliceParams<T, Key> = {
};

/**
 * throws if:
 *  - has a cycle
 *  - unconnected node
 *  - root is a lie
 */
declare function rdag_slice<T, Key>(
  graph: Graph,
  root_key: Key,
  params: RdagSliceParams<T, Key>,
): Rdag<T, Key>;

declare function tree_slice<T, Key>(
  rdag: Rdag,
  resolve_cycle: (
  params: TreeSliceParams<T, Key>,
): Tree<T, Key>;

declare function chain_slice<T, Key>(
  tree: Tree,
  params: SliceParams<T, Key>,
): Chain<T, Key>;

type GraphSize = {
  nodes: number;
  edges: number;
  //completeness: number; // [0, 1]
};


// Graphs!
export interface Graph<Key, N> {
  // TODO from ./rdag/public-api
}

export interface GraphNode<Key, N> {
  readonly key: Key;
  readonly graph: Graph<Key, N>;

  readonly yin_edges: ReadonlyArray<GraphEdge<Key, GraphNode<Key, N>>>;
  readonly yang_edges: ReadonlyArray<GraphEdge<Key, GraphNode<Key, N>>>;
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

// RDAGs!
export interface Rdag<Key> extends Graph<Key> {
  readonly root: NodeRef<RdagNode<Key>>;
}

export interface RdagNode<Key> extends GraphNode<Key> {
  readonly root_path: Chain<Key, RdagNode<Key>>;

  readonly rootward_edges: ReadonlyArray<RdagEdge<Key>>;
  readonly rootward_nodes: ReadonlyArray<RdagNode<Key>>;

  readonly leafward_edges: ReadonlyArray<RdagEdge<Key>>;
  readonly leafward_nodes: ReadonlyArray<RdagNode<Key>>;
}

export interface RootedEdge<Key, N> extends GraphEdge<Key> {
  readonly rootward: NodeRef<Key, RdagNode<Key>>;
  readonly leafward: NodeRef<Key, RdagNode<Key>>;
}

// Trees!
export interface Tree extends Graph<Key> {
  readonly root: NodeRef<Key, TreeNode<Key>>;
}

export interface TreeNode<Key> extends RdagNode<Key> {
  readonly rootward_edge: TreeEdge<Key>;
  readonly rootward_node: NodeRef<Key, TreeNode<Key>>;
}

export interface TreeEdge<Key> extends RdagEdge<Key> {
}

// Chain!
// RDAG with one leaf node
// In simplest form, each node has one parent, one child
export interface Chain {
  readonly root: NodeRef<ChainNode<Key>>;
  readonly leaf: NodeRef<ChainNode<Key>>;
}

export interface ChainNode<Key> extends GraphNode<Key> {
  readonly root_distance: number;
  readonly leaf_distance: number;
  readonly depth: number;
  readonly parent_count: number;
  readonly child_count: number;
  readonly parents: ReadonlyArray<RdagEdge<Key>>;
  readonly children: ReadonlyArray<RdagEdge<Key>>;
  readonly parent_edges: ReadonlyArray<RdagEdge<Key>>;
  readonly child_edges: ReadonlyArray<RdagEdge<Key>>;
}

export interface RdagEdge<Key> extends GraphEdge<Key> {
  readonly subtree_size: number;
}

export interface HasContents<T> {
  contents: T;
}
