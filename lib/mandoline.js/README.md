## mandoline.js
A tool for slicing and dicing graphs, webs, and networks
  RDAG is a rooted slice of a graph/web/network
  tree is an acyclic slice of an RDAG
  chain is a 1-degree slice of a tree

e.g. 
  RDAG breadcrumbs of a web browsing session form a slice of the web
  DOM tree the currently rendered slice of an RDAG
  for a node in a tree, the path to the root is a chain

"mandoline voyage"?

note: default javascript prototypes form an RDAG rooted at Object.prototype
      could lean on that as a foundation?
NOTE: ONLY IF THE STRUCTURE IS ENCAPSULATED
      don't place that burden on anyone who didn't ask for it
