import Component from '@glimmer/component';

import RdagEvent from './events/rdag-event';
import RdagEventHandlers from './events/handlers';

export class RootEventHandlers implements RdagEventHandlers {
  manager: RdagManager;

  constructor(manager: RdagManager) {
    this.manager = manager;
  }

  register(event: RdagEvent) {
    // TODO
  }

  unregister(event: RdagEvent) {
    // TODO
  }
}

export default class Rdag extends Component
{
  @action
  start_listening(element: Element) {
    add_rdag_event_listeners(
      element,
      new RootEventHandlers(new RdagManager()),
    );
  }
}
