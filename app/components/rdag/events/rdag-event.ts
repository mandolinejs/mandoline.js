import {
  Key,
} from './manager';
import {
  RdagEventName,
} from './names';

type Delegate<T> = (_: T) => void;

type OptionalEventArgs = {
  delegate_element_manager?: Delegate<RdagElementManager>,
};

type RdagEventDetail = {
  event_name: RdagEventName,
  target_key: Key,
  optional_args: OptionalEventArgs,
};

export default class RdagEvent extends CustomEvent {
  detail!: Readonly<RdagEventDetail>;

  constructor(
    event_name: RdagEventName,
    target_key: Key,
    optional_args: OptionalEventArgs = {},
  ) {
    super(
      global_event_name(event_name),
      {
        detail: {
          event_name,
          target_key,
          optional_args,
        },
      }
    );
  }
}
