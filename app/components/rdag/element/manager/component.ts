import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export type RdagElementManager = Readonly<Pick<
  RdagElementManagerComponent,
  'rendering_dom_element' |
  'should_render_in_element' |
>>;

export default class RdagElementManagerComponent extends Component {
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
