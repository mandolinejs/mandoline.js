const ops = {
  leafward_edge: '->',
};

function starts_with_edge(line: string) {
  return new RegExp(`^${ops.leafward_edge}`);
}

function is_empty(line: string) {
  return !line;
}

type TreemlBlock = ReadonlyArray<string>;

type ParserRectangle = {
  start_line: number,
  end_line: number,
  start_column: number,
  end_column?: number,
};

// View on a rectangle of treeml input that represents a single tree
class TreemlTree {
  constructor(
    public input: TreemlBlock,
    public start_line: number,
    public end_line: number,
    public start_column: number,
  ) {
  }

  get root_key(): string {
    const op_index = this.first_line.indexOf(ops.leafward_edge);
  }

  *lines() {
    for (const line of this.input.slice(
      this.start_line,
      this.end_line,
    )) {
      yield line.slice(
        this.start_column,
        this.end_column,
      );
    }
  }

  get first_line() {
    const line = this.input[this.start_line];
    return line ?
      line.slice(this.start_column, this.end_column) :
      undefined;
  }

  *split(should_split_before: (line: string) => boolean) {
    let chunk = this.clone();
    for (const line of this.lines()) {
      if (chunk.length && should_split_before(line)) {
        yield chunk;
        chunk = [];
      }
      if (line.length) {
        chunk.push(line);
      }
    }
    if (chunk.length) {
      yield chunk;
    }
  }

  clone() {
    return new Rectangle(
      this.input,
      this.start_line,
      this.end_line,
      this.start_column,
      this.end_column,
    );
  }
}

class GraphParser {
  graph: Graph;
  input: Array<string>;

  constructor(input: string) {
    this.graph = new Graph();
    this.input = input.split('\n');
  }

  parse() {

  }

  parse_block(rect: Rectangle) {
    for (const child_tree of rect.split(
      line => line[0] !== ' ',
    )) {
      this.parse_tree(child_tree);
    }
  }

  parse_tree(rect: Rectangle) {
    /* assumes a single root, e.g.
     * graph```
     * a -> b -> c -> f
     *             -> g
     *        -> d -> e
     * ```
     */
    const first_line = rect.first_line();
    const edge_index = first_line.indexOf(ops.leafward_edge);
    const root_key = first_line.slice(0, edge_index).trim();
    const root = this.graph.get_or_add_node(root_key);
    this.graph.add

    for (const child_tree of rect.split(
      line => line.indexOf(ops.leafward_edge) === edge_index,
    )) {

    }
  }

  *slice_lines(
    rectangle: ParserRectangle,
  ) {
    // TODO: cache/memoize?
    for (const line of this.input.slice(
      rectangle.start_line,
      rectangle.end_line,
    )) {
      yield line.slice(
        rectangle.start_column,
        rectangle.end_column,
      );
    }
  }
}
