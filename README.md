# mandoline.js [WIP]

A tool for slicing and dicing graphs, networks, and webs.

Given a web, each added constraint slices a smaller shape:
  - Slice to connected web: choose a root node, remove all unconnected.
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

```treeml
-> means depends-on

treeml

walker

mandoline -> treeml
          -> walker

gingerbread -> mandoline
```

same web rooted differently
```treeml
constraints <> treeml
            <- mandoline
            <- gingerbread

treeml <- mandoline <- gingerbread
```


## define some concepts in terms of their constraints

```constraints

constrain fit such that:
  can verify given web
  easy to slice given web to fit by removing/adding edges/nodes

  given web verified to fit, small changes to the web:
    easy to verify whether the changes would cause the web not to fit



constrain rdag such that:
  isa web

  has a root
        node with a path to each other node

  has no cycles
         paths that lead from a node back to itself

  can slice to fit
  given web, root:
    walk the web starting at root.
    at each node:
      skip outgoing edges that lead to visited nodes closer to root


constrain pipe such that:
  isa rdag

  has exactly one leaf
              node with zero outgoing edges

  can slice to fit
  given rdag, leaf:
    walk the rdag starting at leaf, rootward.
```

## how to slice a web

First, choose where in a given web to start. Pick a thing
                                                    node
                                                    page
                                                    vertex
                                                    place
and name that thing `root`.


Next, take a walk. Starting at `root`, step along some edges to visit
connected nodes. You could follow every edge, or follow none. From each visited
node, take more steps to any number of adjacent nodes.


Define a slice by including all the nodes you walked through
                                the edges that connected them.
Order does not matter.


Define a walk by describing how to choose edges to follow from a given node.
