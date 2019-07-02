type Key = string;
type Edge = [Key, Key];

interface Graph {
  nodes: Iterable<Key>;
  edges: Iterable<Edge>;

  get_in_edges(key: Key): Iterable<Edge>;
  get_out_edges(key: Key): Iterable<Edge>;
}

interface Rdag {
  readonly graph: Graph;
  root: RdagNode;
}

interface Pipe extends Rdag {
  leaf: RdagNode;
}

// from the perspective of a given node:
//  in-edges are "rootward"
//  out-edges are "leafward"
interface RdagNode {
  is_root: boolean;
  is_leaf: boolean;

  rootward_nodes: Iterable<RdagNode>;
  leafward_nodes: Iterable<RdagNode>;
}

type SliceRdagParams = {
  graph: Graph,
  root_key: Key,
};
function slice_rdag({ graph, root_key }: SliceRdagParams): Rdag {
}

type SlicePipeParams = {
  graph: Graph,
  root_key: Key,
  leaf_key: Key,
} | {
  rdag: Rdag,
  leaf_key: Key,
};
function slice_pipe(params: SlicePipeParams): Pipe {
}

class RdagView implements Rdag {
  constructor(
    public readonly graph: Graph,
    public readonly root_key: Key,
  ) {
  }

  // allow lazy walking
}

class RdagNodeView implements RdagNode {
  constructor(
    public readonly rdag: Rdag,
    public readonly key: Key,
  ) {
  }
}
