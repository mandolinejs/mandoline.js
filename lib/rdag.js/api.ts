
/****** public api ******/

export type NodeParams<T = unknown, Key> = {
    key: Key,
    parents?: Array<Key>,
    children?: Array<Key>,

    contents?: T,
};

export type EdgeParams<T = unknown, Key> = {
    parent_key: Key,
    child_key: Key,

    contents?: T,
};

export type RemoveOptions = {
    prune_orphans?: boolean;
};

export interface Rdag<T, Key> {
    readonly is_empty: boolean;

    // throws if empty
    readonly root: RdagNode<T, Key>;

    // throws if:
    //  - duplicate key
    //  - doesn't connect to root
    //  - causes cycle
    add_node(
        params: NodeParams<T, Key>,
    ): RdagNode<T, Key>;

    // throws if:
    //  - key missing
    //  - leaves orphans and !options.prune_orphans
    remove_node(
        key: Key,
        options?: RemoveOptions,
    ): T;

    // throws if key missing
    get_node(
        key: Key,
    ): RdagNode<T, Key>;

    // throws if:
    //  - key(s) missing
    //  - causes cycle
    add_edge(
        params: EdgeParams<T, Key>,
    ): RdagEdge<T, K>;

    // throws if:
    //  - key(s) missing
    //  - leaves orphans and !options.prune_orphans
    remove_edge(
        parent_key: Key,
        child_key: Key,
        options?: RemoveOptions,
    ): T;

    // throws if key(s) missing
    get_edge(
        parent_key: Key,
        child_key: Key,
    ): RdagEdge<T, Key>;
}

export interface RdagNode<T, Key> {
    readonly key: Key;
    readonly depth: number;
    readonly parents: ReadonlyArray<RdagEdge<T, Key>>;
    readonly children: ReadonlyArray<RdagEdge<T, Key>>;
    readonly parent_edges: ReadonlyArray<RdagEdge<T, Key>>;
    readonly child_edges: ReadonlyArray<RdagEdge<T, Key>>;

    contents: T;
}

export interface RdagEdge<T, Key> {
    readonly parent_key: Key;
    readonly child_key: Key;
    readonly subtree_size: number;
    readonly parent_node: RdagNode<T, Key>;
    readonly child_node: RdagNode<T, Key>;

    contents: T;
}


