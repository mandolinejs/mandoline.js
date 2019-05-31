import Component from '@glimmer/component';

const EVENTS = {
  didInsert: 'rdag::did-insert-element',
  willDestroy: 'rdag::will-destroy-element',
};

export default class RdagElement extends Component {
  element: HtmlElement;

  @action
  sayHello(element: HtmlElement, id: unknown) {
    element.dispatchEvent(
      this.getCustomEvent(EVENTS.didInsert, id),
    );
  }

  @action
  sayGoodbye() {
    element.dispatchEvent(
      this.getCustomEvent(EVENTS.willDestroy, id),
    );
  }

  private getCustomEvent(eventType: string, id: unknown) {
  }
}
