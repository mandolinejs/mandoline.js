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

different parsers to allow variants, like
```treeml.text
How to slice a web:

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

## build an abstract syntax web

to parse treeml into an abstract syntax web,
```treeml.code
split lines into paragraphs however you want (default: on blank lines)

for each line of a given paragraph:
  split into tokens however you want (default: on spaces)
  set tabstops at the start of each token
  compare first tabstop with the line above:
    if the line above starts earlier:
      
    
      
    tabstops should match up
    connect first token to the above token with the same tabstop
    push first tabstop onto a stack
  connect each token to the token before
```

```treeml.code
for paragraph of @split.paragraphs(@lines):
  for text_line of paragraph.text_lines:
    this_line = {
      tokens: @split.tokens(text_line),
      tabstops: map(tokens, t => t.tabstop),

      get parent() {
        if not last_line:
          return void
        if this.first_tabstop == last_line.first_tabstop:
          return last_line.parent_token
        if this.first_tabstop in last_line.tabstops:
          return last_line.tokens[first_tabstop].parent
        return last_line.last_token
      }
    }
```

to render, partition the web into trees
