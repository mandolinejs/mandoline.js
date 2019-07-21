type Key = unknown;
type KeySet = Array<Key>;

type Web = {
  has_key(key: Key): boolean;
  edges_from(key: Key): KeySet;
  edges_into(key: Key): KeySet;
}

type Slicer = {
  slice(web: Web, root_key: Key) => Maybe<Slice>;
}

type Slice = Web & {
  source_web: Web;
  root_key: Key;
  leaf_keys: Maybe<KeySet>;
}



type SlicerBlade = (web: Web, from_key: Key) => Maybe<KeySet>;

const full_slice: SlicerBlade =
  (web, from_key) => web.edges_from(from_key);

const full_backward_slice: SlicerBlade =
  (web, from_key) => web.edges_into(from_key);

const binary_tree: SlicerBlade =
  (web, from_key) => web.edges_from(from_key).slice(0, 2);
