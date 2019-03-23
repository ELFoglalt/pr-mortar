import { Vector } from 'vector2d';

export class MapState {
  constructor(firingPosition = null, targetPosition = null, targetOffset = new Vector(0, 0)) {
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
