import Component from '@glimmer/component';

import {
  RdagEventHandlers,
} from './events/handlers';

import { RdagManager } from '../manager';
import { RdagElementManager } from './manager';

const element_event_handlers: Partial<RdagEventHandlers> = {
};

type Args = {
  rdag_manager: RdagManager,
  key: Key,
  tag_name?: string,
};

export default class RdagElement extends Component<Args> {
  @tracked
  manager?: RdagElementManager;

  @tracked
  dom_element?: Element;

  get should_render_content() {
    const {
      dom_element,
      args: {
        manager,
      }
    } = this;

    if (!manager || !dom_element) {
      throw Error('Must call `say_hello` before using `should_render_content`');
    }

    return manager.should_render_in_element(dom_element);
  }

  @action
  say_hello(element: Element) {
    const {
      key,
      rdag_manager,
    } = this.args;

    this.dom_element = element;
    this.manager = rdag_manager.register_element(

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
