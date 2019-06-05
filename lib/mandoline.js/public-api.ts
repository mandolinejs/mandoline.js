import { Rdag } from './rdag/public-api';

type Graph = unknown;

export type SliceParams<T, Key> = {
  nodes: Array<Key>,
  edges: Array<[Key, Key]>,
};

/**
 * throws if:
 *  - has a cycle
 *  - unconnected node
 *  - root is a lie
 */
export function slice(
  graph: Graph,
  root_key: Key,
  params: SliceParams<T, Key>,
): Rdag<T, Key>;

export function nearby_slice(
  graph: Graph,
  root_key: Key,
  depth: number,
): Rdag<T, Key>;
