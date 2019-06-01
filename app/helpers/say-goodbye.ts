export default function say_goodbye(
  element: HtmlElement,
  id: unknown,
) {
  element.dispatchEvent(
    this.getCustomEvent(EVENTS.willDestroy, id),
  );
}
