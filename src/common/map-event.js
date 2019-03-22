import { Vector } from 'vector2d';

export class MapState {
  constructor(firingPositon = null, targetPosition = null, targetOffset = new Vector(0, 0)) {
    this.firingPositon = firingPositon;
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
