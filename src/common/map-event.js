export class MapState {
  constructor(firingPosition = null, targetPosition = null, targetOffset = { x: 0, y: 0 }) {
    this.firingPosition = firingPosition;
    this.targetPosition = targetPosition;
    this.targetOffset = targetOffset;
  }
}

export class MapEvent {
  constructor(command = null, state = new MapState()) {
    this.command = command;
    this.state = state;
  }
}
