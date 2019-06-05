import { Rdag } from './rdag/public-api';

import * as api from './public-api';


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
): Rdag<T, Key> {
}

export function nearby_slice(
  graph: Graph,
  root_key: Key,
  depth: number,
): Rdag<T, Key>;
