import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type Key = Exclude<unknown, undefined | null>;

export type RdagManager = Readonly<Pick<
  RdagManagerComponent,
  'register_element' |
  'unregister_element' |
>>;

export default class RdagManagerComponent extends Component {
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
