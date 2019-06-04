import * as api from './public-api';

interface GraphNodeManager {

}

interface GraphManager {
  nx_graph: jsnx.Graph;

}

interface RdagNodeManager<T, Key> {
  key: Key;
  depth: number;
  parents: ReadonlyArray<RdagNodeManager>;
  children: ReadonlyArray<RdagNodeManager>;
}

interface RdagManager<T, Key> {
  root_manager: RdagNodeManager;

  get_node_manager(key: Key) : RdagNodeManager;

  /**
   * @method add_node
   * throw if Rdag non-empty and new node doesn't connect to root
   * or if it introduces a cycle
   * has to stay an rdag
   */
  add_node(
    {
      key,
      contents,
      parents,
      children,
    }: NodeParams<T, Key> = {},
  ): RdagNodeManager;
}



/****** implementation ******/
export class Rdag<T = unknown, Key = unknown>
  implements api.Rdag<T, K>
  {
    constructor() {
      this.nodes = {};
    }

    get root(): RdagNode<T> | null {
    }

    /**
     * @method add_node
     * throw if Rdag non-empty and new node doesn't connect to root
     * or if it introduces a cycle
     * has to stay an rdag
     */
    add_node(
      {
        key,
        contents,
        parents,
        children,
      }: NodeParams<T, Key> = {},
    ) {
    }
  }
