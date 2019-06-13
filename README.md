# mandoline.js
A tool for slicing and dicing graphs, networks, and webs.
Given a graph, each added constraint slices a smaller shape:
  Slice to connected graph: choose a root node, remove all unconnected.
  Slice to RDAG: remove one edge from each cycle.
  RDAG can be sliced multiple ways:
    Slice to a tree: for each node, remove all but one parent edge.
    Slice to a pipe: choose a leaf node, remove nodes that don't lead to leaf.
  Slice tree or pipe to chain: remove all but one path from root to one leaf.

"mandoline voyage"?

note: JS prototype chains form an RDAG, could lean on that as a foundation?
      highly optimized in modern browsers
NOTE: ONLY IF THE STRUCTURE IS ENCAPSULATED
      don't place that burden on anyone who didn't ask for it


## constraints

define constraints, fit such that:
  given graph:
    able to verify whether the graph fits
    easy to slice the graph to fit by removing/adding edges/nodes

  given graph known to fit, small changes to the graph:
    easy to verify whether the changes would cause the graph not to fit


rooted graph constraints:
  directed graph

  at least one valid root
               node with a path to each other node

  slice given graph, root to fit:
    walk the graph from the root
    prune un-visited nodes

  slice given graph to fit:
    add "index" node as the graph's root node with an edge to each other node


rdag constraints:
  rooted graph

  no cycles

  slice given web, root to fit:
    walk the web from the root
    from each node:
      prune its outgoing edges that point to the walk's already-visited-nodes


tree constraints:
  rdag

  each node has at most one incoming edge

  slice to fit
  given rdag:
    walk the rdag from its root
    from each node:
      prune all but one incoming edge


pipe constraints:
  rdag

  exactly one leaf
              node with zero outgoing edges

  slice to fit
  given rdag, leaf:
    walk the rdag from the leaf, rootward
      prune all un-visited nodes

chain constraints:
  pipe & tree
