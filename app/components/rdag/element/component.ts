import Component from '@glimmer/component';

import {
  RdagEventHandlers,
} from './events/handlers';
import {
  register_element,
  unregister_element,,
} from './utils';

const element_event_handlers: Partial<RdagEventHandlers> = {
};

export default class RdagElement extends Component {
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

    register_element(
      element,
      key,
      manager => this.manager = manager,
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
    unregister_element(element, key);
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
