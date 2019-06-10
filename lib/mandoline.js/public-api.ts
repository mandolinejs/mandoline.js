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


/**** constraints ****/

// define constraints such that:
//  - able to verify whether a given graph fits
//  - easy to slice a given graph to fit by adding/removing nodes/edges
//  - given a graph that fits constraints:
//      easy to verify whether individual changes will still fit

// when importing/building from a given list of nodes/edges:
//  - check constraints.
// either (1) if possible, slice the input to fit within constraints
//     or (2) error.

// web constraints:
//  - directed graph
//  - at least one valid root
//                 node with a path to each other node
// slicing to fit:
//  - given graph, maybe root
//  - if root given, check constraints
//  - if no root given, add an "index" root node with an edge to each other node

// rdag constraints:
//  - same as web
//  - no cycles
// slicing to fit:
//  - given web, root
//  - walk the web from the root
//    at each node, prune outgoing edges to already-visited nodes

// tree constraints:
//  - rdag
//  - each node has at most one incoming edge
// slicing to fit:
//  - given rdag
//  - walk the rdag from its root, breadth first
//    at each node, prune all but one incoming edge

// pipe constraints:
//  - rdag
//  - exactly one leaf
//                node with zero outgoing edges
// slicing to fit:
//  - given rdag, leaf
//  - walk

// Graphs!
interface Graph<Key, N, E> {
  readonly nodes: ReadonlyArray<N>;
  readonly edges: ReadonlyArray<E>;
  readonly params: Readonly<GraphParams<Key>>;
}

type GraphParams = {
  graph?: {
    in_degree?: number;
    out_degree?: number;
    total_degree?: number;
  },
  rdag?: {
    depth?: number;
  },
};

export interface GraphNode<Key, N, E> {
  readonly key: Key;
  readonly graph: Graph<Key, N, E>;

  readonly yin_edges: ReadonlyArray<E>;
  readonly yang_edges: ReadonlyArray<N>;
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
export interface Rdag<
  Key,
  N = RdagNode<Key>,
  E = RdagEdge<Key>,
> extends Graph<Key, N, E> {
  readonly root: NodeRef<K, N>;
}

export interface RdagNode<
  Key,
  N = RdagNode<Key>,
  E = RdagEdge<Key>,
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
  N = RdagNode<Key>,
  E = RdagEdge<Key>,
> extends GraphEdge<Key, N, E> {
  readonly rootward: NodeRef<Key, N>;
  readonly leafward: NodeRef<Key, N>;
}

// Trees!
// RDAG where each non-root node has exactly one parent
export interface Tree<
  Key,
  N = TreeNode<Key>,
  E = TreeEdge<Key>,
> extends Rdag<Key, N, E> {
}

export interface TreeNode<
  Key,
  N = TreeNode<Key>,
  E = TreeEdge<Key>,
> extends RdagNode<Key, N, E> {
  readonly rootward_edge: E | null;
  readonly rootward_node: N | null;
}

export interface TreeEdge<
  Key,
  N = TreeNode<Key>,
  E = TreeEdge<Key>,
> extends RdagEdge<Key, N, E> {
}

// Pipe!
// RDAG with only one leaf.
// All paths from root eventually lead to the one leaf.
// Sorta the opposite of a Tree.
export interface Pipe<
  Key,
  N = PipeNode<Key>,
  E = PipeEdge<Key>,
> extends Rdag<Key, N, E> {
  readonly root: NodeRef<Key, N>;
  readonly leaf: NodeRef<Key, N>;
}

export interface PipeNode<
  Key,
  N = PipeNode<Key>,
  E = PipeEdge<Key>,
> extends RdagNode<Key, N, E> {
}

export interface PipeEdge<
  Key,
  N = PipeNode<Key>,
  E = PipeEdge<Key>,
> extends RdagEdge<Key, N, E> {
}

// Chain!
// Pipe in its simplest form: each node has one parent, one child.
// Basically a linked list.
export interface Chain<
  Key,
  N = ChainNode<Key>,
  E = ChainEdge<Key>,
> extends Pipe<Key, N, E> {
}

export interface ChainNode<
  Key,
  N = ChainNode<Key>,
  E = ChainEdge<Key>,
> extends PipeNode<Key, N, E> {
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

export interface ChainEdge<
  Key,
  N = ChainNode<Key>,
  E = ChainEdge<Key>,
> extends PipeEdge<Key, N, E> {
}

// Other things?
export interface HasContents<T> {
  contents: T;
}
