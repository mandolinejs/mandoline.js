type Values<T extends object> = T[keyof T];

export default class RdagEvent extends CustomEvent {
  readonly name: keyof RdagEvent.Names;
  readonly type: Values<RdageEvent.Names>;

  constructor(event_name: keyof RdagEventNames) {
    super(event_name, {
      detail: {}, // TODO
    });
  }
}
