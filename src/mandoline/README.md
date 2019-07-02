# mandoline

A tool for slicing and dicing graphs, networks, and webs.

```ts
const g = new GraphView(nodes, edges);

const rdag = slice_rdag(g, { root_key });

const pipe = slice_pipe(rdag, { leaf_key });

const same_pipe = slice_pipe(g, { root_key, leaf_key });

const chain = slice_chain(pipe, { path });
```
