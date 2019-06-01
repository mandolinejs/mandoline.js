export const rdag_event_names = Object.freeze([
  'register',
  'unregister',
]);

type Unwrap<T> = T extends Array<infer U> ? U : T;

export type RdagEventName = Unwrap<typeof rdag_event_names>;

export function global_event_name(
  event_name: RdagEventName,
): string {
  return `rdag::${event_name}`;
}
