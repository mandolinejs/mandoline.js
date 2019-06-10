/**** graph constraints ****/

// define constraints, fit such that:
//
//   given graph:
//     able to verify whether the graph fits
//     easy to slice the graph to fit by removing/adding edges/nodes
//
//   given graph known to fit, small changes to the graph:
//     easy to verify whether the changes would cause the graph not to fit

// web constraints:
//
//   digraph
//
//   at least one valid root
//                node with a path to each other node
//
//   verify given graph fits:
//
//   slice given graph, root to fit:
//     walk the graph from the root
//     prune un-visited nodes
//
//   slice given graph to fit:
//     add "index" node as the graph's root node with an edge to each other node

// rdag constraints:
//
//   web
//
//   no cycles
//
//   slice given web, root to fit:
//     walk the web from the root
//     from each node:
//       prune its outgoing edges that point to the walk's already-visited-nodes

// tree constraints:
//
//   rdag
//
//   each node has at most one incoming edge
//
//   slice to fit
//   given rdag:
//     walk the rdag from its root
//     from each node:
//       prune all but one incoming edge

// pipe constraints:
//   rdag
//
//   exactly one leaf
//               node with zero outgoing edges
//
//   slice to fit
//   given rdag, leaf:
//     walk the rdag from the leaf, rootward

function walk<Key, N, E>(
  graph: Graph<Key, N, E>,
  root: Key | N,
) {
}

class Web<Key> implements Graph<Key, WebNode, WebEdge> {
  readonly nodes: ReadonlyArray<N>;
  readonly edges: ReadonlyArray<E>;
  readonly root_key: Key;
  readonly root: N;

  constructor(graph: jsnx.DiGraph, root: Key) {

  }
}










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
