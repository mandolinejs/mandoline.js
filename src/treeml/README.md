# treeml: tree markup language
arbitrary graph, web, or network structure encoded as overlapping trees

```treeml
a -> b
  -> c
```

```treeml
a -> b -> d -> g
       -> e
       -> f
  -> c
```

```treeml
a -> b -> d -> g
       -> e
       -> f
  -> c

g -> b -> a -> h -> i
            -> j
  -> k -> l

i -> h
```

optional constraint: max children for a non-root node

```treeml
a -> b
  -> c

b -> d -> g
  -> e
  -> f

h -> i -> j
  -> n -> o

j -> k -> l
  -> m

p
```

could allow keyed edges, like
```treeml
a -foo> b
b -bar-baz> c
```
