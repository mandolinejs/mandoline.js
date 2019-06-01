Three related tools

- collection of components that convince the DOM tree to act like a rooted
  directed acyclic graph (RDAG)
- graph navigation controls with RDAG breadcrumbs
- text editor where each sentence is an RDAG of words

## rdag-dom

`<Rdag::Element>` is like `HTMLElement` that can have multiple parents.

`<Rdag>` starts a subtree in which DOM events may bubble to multiple
parent `<Rdag::Element>`s.

`RdagEvent` is an `Event` that will not be double-counted when it follows
multiple paths to the same `<Rdag::Element>` or `<Rdag>` root.
