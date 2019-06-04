import jsnx from 'jsnetworkx';
import * as api from './public-api';

export class RdagManager<T = unknown, Key = unknown>
  implements api.Rdag<T, K>
{
  root_key: Key | null = null;

  constructor() {
    this.nx_graph = new jsnx.DiGraph();
  }

  get root(): api.RdagNode<T, Key> {
    return this.get_node(this.root_key);
  }

  get is_empty(): boolean {
    return Boolean(this.root_key);
  }

  add_node(
    {
      key,
      parents,
      children,
      contents,
    }: NodeParams<T, Key> = {},
  ): api.RdagNode<T, Key> {
    const { nx_graph } = this;

    nx_graph.addNode(key, { contents });
    if (parents) {
      nx_graph.addEdgesFrom(
        parents.map(parent_key => [parent_key, key]),
      );
    }
    if (children) {
      nx_graph.addEdgesFrom(
        children.map(child_key => [key, child_key]),
      );
    }
    return this.get_node(key);
  }

  remove_node(
    key: Key
    options: api.RemoveOptions = {},
  ): void {
    this._remove_node(
      this.get_node(key),
      options,
    );
  }

  _remove_node(
    node: api.RdagNode<T, Key>,
    options: api.RemoveOptions,
  ): void {
    const orphans = node.children.filter(
      child => (child.parent_count <= 1),
    );

    if (orphans.length && !options.prune_orphans) {
      throw Error(`Oh no, orphans! Trying to remove "${key}"`);
    }

    orphans.forEach(
      orphan => this._remove_node(orphan, options),
    );

    this.nx_graph.removeNode(key);
  }

  get_node(
    key: Key,
  ): api.RdagNode<T, Key> {
    const { data } = this.nx_graph.get(key);

    if (!data.node_manager) {
      data.node_manager = new RdagNodeManager(this, key);
    }

    return data.node_manager;
  }

  add_edge(
    {
      parent_key,
      child_key,
      contents,
    }: api.EdgeParams<T, Key>,
  ): api.RdagEdge<T, K> {
    this.nx_graph.addEdge(
      [parent_key, child_key],
      { contents },
    );

    return this.get_edge(parent_key, child_key);
  }

  // throws if:
  //  - key(s) missing
  //  - leaves orphans and !options.prune_orphans
  remove_edge(
    parent_key: Key,
    child_key: Key,
    options: RemoveOptions = {},
  ): void {
    const child = this.get_node(child_key);

    if (child.parent_count <= 1) {
      if (options.prune_orphans) {
        this._remove_node(child, options);
      } else {
        throw Error(`Oh no, orphans! Removing edge (${parent_key}, ${child_key})`);
      }
    }

    this.nx_graph.removeEdge(parent_key, child_key);
  }

  // throws if key(s) missing
  get_edge(
    parent_key: Key,
    child_key: Key,
  ): RdagEdge<T, Key> {
    const data = this.nx_graph.getEdgeData(parent_key, child_key);

    if (!data.edge_manager) {
      data.edge_manager = new RdagEdgeManager(this, parent_key, child_key);
    }

    return data.edge_manager;
  }
}

class RdagNodeManager<T, Key> implements api.RdagNode<T, Key> {
  constructor(
    rdag: api.Rdag<T, Key>,
    key: Key,
  ) {
    this.rdag = rdag;
    this.key = key;
  }
}

class RdagEdgeManager<T, Key> implements api.RdagEdge<T, Key> {
  constructor(
    rdag: api.Rdag<T, Key>,
    parent_key: Key,
    child_key: Key,
  ) {
    this.rdag = rdag;
    this.parent_key = parent_key;
    this.child_key = child_key
  }
}
