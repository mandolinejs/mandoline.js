const ops = {
  leafward_edge: '->',
};

function starts_with_edge(line: string) {
  return new RegExp(`^${ops.leafward_edge}`);
}

function is_empty(line: string) {
  return !line;
}

type TreemlBlockParams = {
  input: ReadonlyArray<string>,
  start_line: number,
  end_line: number,
  start_column: number,
};

type CloneParams = {
  start_line_delta: number,
  line_count: number,
  start_column_delta: number,
};

// View on a rectangle of treeml input that represents a single tree
class TreemlBlock {
  constructor(
    { input, start_line, end_line, start_column }: TreemlBlockParams,
  ) {
    Object.assign(
      this,
      { input, start_line, end_line, start_column },
    );
  }

  get root_key(): string {
    const { first_line } = this;

    const key_regex = new RegExp(
      `^\s*(?:${ops.leafward_edge}\s*)?(?<root_key>\S+)`,
    );

    const key_match = first_line.match(key_regex);
    if (!key_match) {
      throw new Error(`No key found: "${first_line}"`);
    }

    return key_match.groups.root_key;
  }

  *lines() {
    // TODO memoize?
    for (const line of this.input.slice(
      this.start_line,
      this.end_line,
    )) {
      yield line.slice(this.start_column);
    }
  }

  get first_line() {
    const line = this.input[this.start_line];
    return line ?
      line.slice(this.start_column) :
      undefined;
  }

  *split_before_each(should_split: (line: string) => boolean) {
    let chunk_start = 0;
    let chunk_end = 0;
    for (const line of this.lines()) {
      const chunk_length = chunk_end - chunk_start;

      if (chunk_length && should_split(line)) {
        yield this.clone({
          start_line_delta: chunk_start,
          line_count: chunk_length,
        });
        chunk_start = chunk_end;
      }
    }
    if (chunk.length) {
      yield chunk;
    }
  }

  clone(params: Partial<CloneParams> = {}) {
    const { input, start_line, end_line, start_column } = this;
    const {
      start_line_delta = 0,
      end_line =
      start_column_delta = 0,
    }: CloneParams = params;

    return new TreemlBlock({
      input,
      start_line: start_line + start_line_delta,
      end_line: end_line + end_line_delta,
      start_column: start_column + start_column_delta,
    });
  }
}

class TreemlParser {
  output: Graph;
  input: Array<string>;

  constructor(input: string) {
    this.input = input.split('\n');
    this.output = new Graph();
  }

  parse() {

  }

  parse_block(block: TreemlBlock) {
    for (const child_tree of block.split_before_each(
      line => line[0] !== ' ',
    )) {
      this.parse_tree(child_tree);
    }
  }

  parse_tree(block: TreemlBlock) {
    /* assumes a single root, e.g.
     * treeml```
     * a -> b -> c -> f
     *             -> g
     *        -> d -> e
     * a b c f
     *       g
     *     d e
     * ```
     */
    const { graph } = this;
    const { first_line } = block;

    const edge_index = first_line.indexOf(ops.leafward_edge);
    const root_key = first_line.slice(0, edge_index).trim();
    const root = output.get_or_add_node(root_key);
    const child_trees = block.split_before_each(
      line => line.indexOf(ops.leafward_edge) === edge_index,
    );

    for (const child_tree of child_trees) {
      output.add_edge(root, child_tree.root);
      this.parse_
    }
  }
}
