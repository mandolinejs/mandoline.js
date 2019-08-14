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
  note: that might also be a terrible idea
</aside>
<aside>
how much of this does tinkerpop already take care of?

tinkerpop: https://tinkerpop.apache.org/ 
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

```treeml.constraints

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
    walk rdag starting at the leaf, rootward.


constrain ring such that:
  isa pipe where the leaf is the root

  can slice to fit
  given web, root:
    slice two rdags:
      along outgoing edges
      along incoming edges
    take their intersection

  every cyclic path passes through the root
  the root is an essential node in the ring
  it may be the only one
  or may be all nodes are essential


constrain yang-yin such that:
  isa ring with exactly two essential nodes

  heuristic for balance:
    take many cyclic path slices -- more is better
    for each slice:
      consider the distance between yin and yang
```

```treeml.text
a trailmap is:
  a set of milestones
  web such that milestones are connected by pipes

a timeline is:
  a trailmap that forms a linked list of milestones
  each milestone is an essential node
```

## how to slice a web

```treeml.text
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
```
