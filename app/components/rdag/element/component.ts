import Component from '@glimmer/component';

import {
  RdagEventHandlers,
} from './events/handlers';

const element_event_handlers: Partial<RdagEventHandlers> = {
};

type Args = {
  key: Key;
  tagName?: string;
};

export default class RdagElement extends Component<Args> {
  @tracked
  dom_element?: Element;

  @tracked
  manager?: RdagElementManager;

  get should_render_content() {
    const {
      manager,
      dom_element,
    } = this;

    if (!manager || !dom_element) {
      throw Error('Must call `say_hello` before using `should_render_content`');
    }

    return manager.should_render_in_element(dom_element);
  }

  @action
  say_hello(element: Element, key: unknown) {
    this.dom_element = element;

    element.dispatchEvent(
      new RdagEvent(
        'register',
        key,
        manager => this.manager = manager,
      ),
    );

    add_rdag_event_listeners(
      element,
      element_event_handlers,
    );
  }

  @action
  say_goodbye(element: Element, key: unknown) {
    this.manager = undefined;
    this.dom_element = undefined;

    element.dispatchEvent(
      new RdagEvent('unregister', key),
    );
  }

  @action
  focus_rendered_element() {
    const { rendering_dom_element } = this.manager;
    if (rendering_dom_element) {
      rendering_dom_element.focus();
    }
  }

  @action
  render_here() {
    this.manager.set_rendering_element(this.dom_element);
  }
}
