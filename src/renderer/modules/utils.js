import { Vector } from 'vector2d';

export function mergeRegGroup(...args) {
  const stripped = args.map(group =>
    (group && group[0] === '[' ? group.substr(1, group.length - 2) : group));
  return `[${stripped.join('')}]`;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function normalizeVector(v) {
  const magnitude = Math.hypot(v.x, v.y);
  const magnitudeVector = new Vector(magnitude, magnitude);
  return v.clone().divV(magnitudeVector);
}

export function lookAtVector(p1, p2) {
  return p2.clone().subtract(p1);
}

export function vectorDistance(p1, p2) {
  const { x, y } = lookAtVector(p1, p2).toObject();
  return Math.hypot(x, y);
}

export function lookAtDirection(p1, p2) {
  return normalizeVector(lookAtVector(p1, p2));
}

export function vectorFromStore(storeVector) {
  return new Vector(storeVector._x, storeVector._y); // eslint-disable-line
}

export default {
  mergeRegGroup,
  clone,
  normalizeVector,
  lookAtVector,
  vectorDistance,
  lookAtDirection,
};
