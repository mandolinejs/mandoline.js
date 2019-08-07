import Maybe, { just, nothing } from 'true-myth/maybe'

type Key = unknown;
type MassValue = unknown;
type TimeValue = unknown;

function default_to<V>(val: V | undefined, default_val: V): V {
  return typeof val === 'undefined' ? default_val : val;
}

interface Timeline<V> {
  time_index(time: TimeValue): Maybe<number>;

  get_value_at(time: TimeValue): V;

  set_value_at(time: TimeValue, value: V): void;

  reset(initial_value?: V): void;

  constructor(initial_value: V): Timeline<V>;
}

class Timeline<V> {
  private values: Array<V | undefined>;

  time_index(time: TimeValue) {
    return Maybe.of(
      typeof time === 'number' ? time : undefined,
    );
  }

  get_value_at(time: TimeValue) {
    const time_index = this.time_index(time);
    return Maybe.of(
      this.values[time_index],
    );
  }

  set_value_at(time: TimeValue, value: V) {
    const time_index = this.time_index(time);
    this.values[time_index] = value;
  }

  reset(initial_value?: V) {
    this.initial_value = default_to(initial_value, this.initial_value);
    this.values = [this.initial_value];
  }

  constructor(
    private initial_value: V,
  ) {
    this.values = [initial_value];
  }
};

interface Planet {
  mass: Timeline<MassValue>,
}

export class SimplePlanet implements Planet {
  readonly mass: Timeline<MassValue>;

  constructor(
    initial_mass: MassValue,
  ) {
    this.mass = new Timeline(initial_mass);



  }
}
