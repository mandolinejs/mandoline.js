import {
  Events,
  dispatch_rdag_event,
} from './event-utils';

export function register_element(
  element: Element,
  key: unknown,
) {
  dispatch_rdag_event(
    element,
    Events.register,
    key,
  );
}

export function unregister_element(
  element: Element,
  id: unknown,
) {
  dispatch_rdag_event(
    element,
    Events.unregister,
    key,
  );
}
