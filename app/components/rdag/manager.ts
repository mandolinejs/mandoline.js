import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type Key = Exclude<unknown, undefined | null>;

export class RdagElementManager {
  @tracked
  dom_elements: ReadonlyArray<Element> = [];

  @tracked
  rendering_dom_element: Element | null = null;

  get has_dom_elements() {
    return Boolean(this.dom_elements.length);
  }

  should_render_in_element(element: Element): boolean {
    return element === this.rendering_dom_element;
  }

  add_dom_element(element: Element) {
    this.dom_elements = [
      ...this.dom_elements,
      element,
    ];

    // TODO: call this elsewhere instead?
    this.set_rendering_element(element);
  }

  remove_dom_element(element: Element) {
    this.dom_elements = this.dom_elements.filter(
      e => e !== element,
    );

    if (this.should_render_in_element(element)) {
      this.set_rendering_element();
    }
  }

  set_rendering_element(element?: Element) {
    assert(
      !element || this.dom_elements.includes(element),
      `Invalid RdagElementManager rendering element: ${element}`,
    );

    // TODO: how should it fall when nothing is given?
    this.rendering_dom_element = element ||
      this.dom_elements[0] ||
      null;
  }
}

export default class RdagManager {
  _key_to_element_manager: Record<
    Key,
    RdagElementManager,
  > = Object.create(null);

  _element_to_key = new WeakMap<Element, Key>();

  /**
   */
  register_element(
    dom_element: Element,
    key: Key,
    delegate_element_manager?: (manager: RdagElementManager) => void,
  ): RdagElementManager {
    this._element_to_key.set(element, key);

    const element_manager = this._get_or_create_element_manager(key);
    element_manager.add_dom_element(element);
    if (delegate_element_manager) {
      delegate_element_manager(element_manager);
    }
    return element_manager;
  }

  /**
   */
  unregister_element(
    element: Element,
  ): void {
    const element_manager = this.get_element_manager(element);
    element_manager.remove_dom_element(element);
    if (!element_manager.has_dom_elements) {
      const key = this._get_key(element);
      delete this._key_to_element_manager[key];
    }
  }

  /**
   */
  get_element_manager(key_or_element: Key | Element): RdagElementManager {
    const key = key_or_element instanceof Element ?
      this._get_key(key_or_element) :
      key_or_element;

    const element_manager = this._key_to_element_manager[key];

    assert(
      Boolean(element_manager),
      `Element key not registered: ${key}`,
    );

    return element_manager;
  }

  /**
   */
  _get_key(element: Element): Key {
    const key = this._element_to_key.get(key_or_element);

    assert(
      Boolean(key),
      `Unrecognized element: ${element}`,
    );

    return key;
  }

  /**
   */
  _get_or_create_element_manager(key: Key) {
    let element_manager = this._key_to_element_manager[key];
    if (!element_manager) {
      element_manager = new RdagElementManager(key);
      this._key_to_element_manager[key] = element_manager;
    }
    return element_manager;
  }
}
