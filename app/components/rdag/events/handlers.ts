import { rdag_event_names, RdagEventName } from './names';
import RdagEvent from './rdag-event';

export type RdagEventHandler = (event: RdagEvent) => void;

export type RdagEventHandlers = Record<
  RdagEventName,
  RdagEventHandler
>;

function for_each_event_handler(
  handlers: Partial<RdagEventHandlers>,
  callback: ({
    event_name: RdagEventName,
    handler: RdagEventHandler,
  }) => void;
) {
  rdag_event_names
    .map(
      event_name => ({ event_name, handler: handlers[event_name] }),
    )
    .filter(
      ({ handler }) => Boolean(handler),
    )
    .forEach(callback);
}

export function add_rdag_event_listeners(
  target: EventTarget,
  handlers: Partial<RdagEventHandlers>,
) {
  for_each_event_handler(
    handlers,
    ({ event_name, handler}) => target.addEventListener(
      global_event_name(event_name),
      handler,
    ),
  );
}

export function remove_rdag_event_listeners(
  target: EventTarget,
  handlers: Partial<RdagEventHandlers>,
) {
  for_each_event_handler(
    handlers,
    ({ event_name, handler }) => target.removeEventListener(
      global_event_name(event_name),
      handler,
    ),
  );
}
