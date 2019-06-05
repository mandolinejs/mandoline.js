Three related tools

- [mandoline.js](./mandoline.js)
  - A tool for cutting rooted slices from a graph
  - e.g. DOM tree is a slice of an RDAG
    breadcrumbs of a browsing session form a slice of the web

- discrete navigation controls with RDAG breadcrumbs
- text editor where each sentence is an RDAG of words

## rdag-dom

`<Rdag::Element>` is like `HTMLElement` that can have multiple parents.

`<Rdag>` starts a subtree in which DOM events may bubble to multiple
parent `<Rdag::Element>`s.

`RdagEvent` is an `Event` that will not be double-counted when it follows
multiple paths to the same `<Rdag::Element>` or `<Rdag>` root.
