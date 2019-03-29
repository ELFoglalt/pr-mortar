const { Vector } = require('vector2d'); // prettier-ignore

function lookAtVector(p1, p2) {
  return p2.clone().subtract(p1);
}

function angleFromDirection(dir) {
  const { x, y } = dir.toObject();
  return (Math.atan2(y, x) / Math.PI) * 180;
}

function deflectionFromPoints(firingPoint, targetPoint) {
  const angle = angleFromDirection(lookAtVector(firingPoint, targetPoint)) + 90;
  return angle >= 0 ? angle : angle + 360;
}

const firingPoint = new Vector(0, 0);
const north = new Vector(0, -1);
const west = new Vector(-1, 0);
const east = new Vector(1, 0);
const south = new Vector(0, 1);
console.log(deflectionFromPoints(firingPoint, north));
console.log(deflectionFromPoints(firingPoint, west));
console.log(deflectionFromPoints(firingPoint, east));
console.log(deflectionFromPoints(firingPoint, south));
