import * as mandoline from 'mandoline';
import test from 'ava';

type Key = string;

// Each key defines a node, each value is an array of keys out-edges lead to
type GraphSpec = Record<Key, Array<Key>>;

test('Graph to RootedGraph', t => {
  const test_cases: Array<{
    graph: GraphSpec,
    rooted_slices: Record<Key, GraphSpec>,
  }> = [
    { // 3 nodes, one edge
      graph: { a: ['b'], b: [], c: [] },
      rooted_slices: {
        a: { a: ['b'], b: [] },
        b: { b: [] },
        c: { c: [] },
      },
    }, { // two disconnected but complete subgraphs
      graph: {
        a: ['b', 'c'],
        b: ['c', 'a'],
        c: ['a', 'b'],
        d: ['e'],
        e: ['d'],
      },
      rooted_slices: {
        a: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        b: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        c: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        d: { d: ['e'], e: ['d'] },
        e: { d: ['e'], e: ['d'] },
      },
    }, { // with a self loop a -> a
      graph: {
        a: ['a', 'b'],
        b: [],
        c: ['b'],
      },
      rooted_slices: {
        a: { a: ['a', 'b'], b: [] },
        b: { b: [] },
        c: { b: [], c: ['b'] },
      },
  ];
});

test('RootedGraph to Rdag', t => {
  const test_cases: Array<{
    graph: GraphSpec,
    acyclic_slices: Record<Key, GraphSpec>,
  }> = [
    {
      graph: { a: ['b'], b: [], c: [] },
      rooted_slices: {
        a: { a: ['b'], b: [] },
        b: { b: [] },
        c: { c: [] },
      },
    }, { // two disconnected but complete subgraphs
      graph: {
        a: ['b', 'c'],
        b: ['c', 'a'],
        c: ['a', 'b'],
        d: ['e'],
        e: ['d'],
      },
      rooted_slices: {
        a: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        b: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        c: { a: ['b', 'c'], b: ['c', 'a'], c: ['a', 'b'] },
        d: { d: ['e'], e: ['d'] },
        e: { d: ['e'], e: ['d'] },
      },
    }, { // with a self loop a -> a
      graph: {
        a: ['a', 'b'],
        b: [],
        c: ['b'],
      },
      rooted_slices: {
        a: { a: ['a', 'b'], b: [] },
        b: { b: [] },
        c: { b: [], c: ['b'] },
      },
  ];
});

test('Rdag to Tree', t => {
});

test('Rdag to Pipe', t => {
});

test('Tree to Chain', t => {
});

test('Pipe to Chain', t => {
});
