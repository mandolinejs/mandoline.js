import Component from '@glimmer/component';

import RdagEvent from './events/rdag-event';
import RdagEventHandlers from './events/handlers';

export class RootEventHandlers implements RdagEventHandlers {
  manager: RdagManager;

  constructor(manager: RdagManager) {
    this.manager = manager;
  }

  register(event: RdagEvent) {
    const {
      target,
      detail: {
        target_key,
        optional_args: {
          delegate_element_manager,
        },
      },
    } = event;

    this.manager.register_element(
      target,
      target_key,
      delegate_element_manager,
    );
  }

  unregister(event: RdagEvent) {
    const {
      target,
      detail: {
        target_key,
      },
    } = event;

    this.manager.unregister_element(
      target,
      target_key,
    );
  }
}

export default class RdagRoot extends Component
{
  @action
  start_listening(element: Element) {
    add_rdag_event_listeners(
      element,
      new RootEventHandlers(new RdagManager()),
    );
  }
}
