# mandoline.js [WIP]

A tool for slicing and dicing graphs, networks, and webs.

Given a graph, each added constraint slices a smaller shape:
  - Slice to connected graph: choose a root node, remove all unconnected.
  - Slice to RDAG: remove one edge from each cycle.
  - RDAG can be sliced multiple ways:
    - Slice to a tree: for each node, remove all but one parent edge.
    - Slice to a pipe: choose a leaf node, remove nodes that don't lead to leaf.
  - Slice tree or pipe to chain: remove all but one path from root to one leaf.

<aside>"mandoline voyage"?</aside>

<aside>
  note: JS prototype chains form an RDAG, could lean on that as a foundation?
        highly optimized in modern browsers
  NOTE: ONLY IF THE STRUCTURE IS ENCAPSULATED
        don't place that burden on anyone who didn't ask for it
</aside>

## describe how this tool relates to some other tools

dependency graph ( `->` means "depends on")
```treeml
mandoline -> treeml
          -> constraints

treeml <-> constraints

gingerbread -> mandoline
            -> constraints
```

same graph rooted differently
```treeml
constraints <> treeml
            <- mandoline
            <- gingerbread

treeml <- mandoline <- gingerbread
```

## define some concepts in terms of their constraints

```constraints

constrain fit such that:
  can verify given graph
  easy to slice given graph to fit by removing/adding edges/nodes

  given graph verified to fit, small changes to the graph:
    easy to verify whether the changes would cause the graph not to fit


constrain rooted-graph such that:
  isa directed-graph

  has at least one valid root
                   node with a path to each other node

  can slice to fit
  given graph, root:
    walk the graph from the root
    prune un-visited nodes

  can slice to fit
  given graph:
    add "index" node as the graph's root node with an edge to each other node


constrain rdag such that:
  isa rooted-graph

  has no cycles

  can slice to fit
  given web, root:
    walk the web from the root
    from each node:
      prune its outgoing edges that point to the walk's already-visited-nodes


constrain tree such that:
  isa rdag

  each node has at most one incoming edge

  can slice to fit
  given rdag:
    walk the rdag from its root
    from each node:
      prune all but one incoming edge


constrain pipe such that:
  isa rdag

  has *one* leaf
            node with zero outgoing edges

  can slice to fit
  given rdag, leaf:
    walk the rdag from the leaf, rootward
      prune all un-visited nodes


constrain chain such that:
  isa tree
  isa pipe 

```
