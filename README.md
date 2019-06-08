Three related tools

- [mandoline.js](./mandoline.js)
  A tool for slicing and dicing graphs, webs, and networks
    RDAG is a rooted slice of a graph/web/network
    tree is an acyclic slice of an RDAG
    chain is a 1-degree slice of a tree
  e.g. 
    RDAG breadcrumbs of a web browsing session form a slice of the web
    DOM tree the currently rendered slice of an RDAG
    for a node in a tree, the path to the root is a chain

- discrete navigation controls with RDAG breadcrumbs
- text editor where each sentence is an RDAG of words

## rdag-dom

`<Rdag::Element>` is like `HTMLElement` that can have multiple parents.

`<Rdag>` starts a subtree in which DOM events may bubble to multiple
parent `<Rdag::Element>`s.

`RdagEvent` is an `Event` that will not be double-counted when it follows
multiple paths to the same `<Rdag::Element>` or `<Rdag>` root.


## flow-text

each sentence an rdag
              a river delta
each word defined

given a dictionary
        wiki namespace
zoom in on a word to see its definition

allow borrowing words from other dictionaries
build a web of references
               loan-words
```conversation
yeah, we're friends! but we don't talk very often.
we're not lauren::friends, but still have a strong connection
```

allow expressing definitions as deltas to other defined concepts
every definition is eventually circular
but try to cast a net wide enough to encircle the whole dictionary
    aim for a complete graph
