import Vector from 'vector2d';

export function mergeRegGroup(...args) {
  const stripped = args.map(group =>
    (group && group[0] === '[' ? group.substr(1, group.length - 2) : group));
  return `[${stripped.join('')}]`;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function normalizeVector(v) {
  const magnitude = Math.hypot(...v.toObject());
  const magnitudeVector = new Vector(magnitude, magnitude);
  return v.clone().divV(magnitudeVector);
}

export function directionFromPoints(p1, p2) {
  return normalizeVector(p2.clone().subtract(p1));
}

export default {
  mergeRegGroup,
  clone,
  normalizeVector,
  directionFromPoints,
};
