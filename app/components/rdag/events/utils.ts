export function dispatch_rdag_event(
  element: Element,
  eventName: keyof EventNames,
  key: unknown,
): void {
  element.dispatchEvent(
    new RdagEvent(
      EventNames[eventName],
      key,
    ),
  );
}
