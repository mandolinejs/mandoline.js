export default function say_hello(
  element: HtmlElement,
  key: unknown,
) {
  element.dispatchEvent(
    this.getCustomEvent(EVENTS.didInsert, key),
  );
}
