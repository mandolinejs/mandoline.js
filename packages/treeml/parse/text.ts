type Paragraph = {
  lines: Array<string>,
  start_index: number,
};
type Token = {
  tabstop: number,
  label: string,
};
type Splits = {
  paragraphs(lines: Array<string>): Array<Array<string>>,
  tokens(line: string): Array<Token>,
};

const split: Splits = {
  paragraphs(lines) {
  },
  tokens(line) {
  },
};

class TextLine {
  text: string;
  tokens: Array<Token>;
  tabstops: Array<number>;

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

export default function text(lines: Array<string>, split: Splits) {
  for (const paragraph of split.paragraphs(lines)) {
    for (const line of paragraph.lines) {
      const tokens = split.tokens(line);
      const tabstops = tokens.map(t => t.tabstop);


    }
}
