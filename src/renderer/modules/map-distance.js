import { Vector } from 'vector2d';
import { mergeRegGroup } from './utils';
import { subKeySizeHMU } from './map-constants';

const groupInt = '[0-9]+';
const unitMeter = 'm';
const unitKeyPad = '[\\/k]';
const groupUnit = mergeRegGroup(unitMeter, unitKeyPad);
const dirNorth = 'N';
const dirSouth = 'S';
const dirWest = 'W';
const dirEast = 'E';
const dirFurther = 'F';
const dirCloser = 'C';
const dirLeft = 'L';
const dirRight = 'R';
const groupCardinal = mergeRegGroup(dirNorth, dirSouth, dirWest, dirEast);
const groupRelative = mergeRegGroup(dirFurther, dirCloser, dirLeft, dirRight);
const groupDirection = mergeRegGroup(groupCardinal, groupRelative);

const distancePattern = `(${groupInt})(${groupUnit})?(${groupDirection})`;

const distanceRegExp = new RegExp(distancePattern, 'i');
const unitMeterRegExp = new RegExp(unitMeter, 'i');
// const unitSubKeyRegExp = new RegExp(unitMeter, 'i');

const dirs = [dirNorth, dirSouth, dirWest, dirEast, dirFurther, dirCloser, dirLeft, dirRight];
const dirRegExps = dirs.map(dir => new RegExp(dir, 'i'));

const cardinalVectors = {
  [dirNorth]: new Vector(0, -1),
  [dirSouth]: new Vector(0, 1),
  [dirWest]: new Vector(-1, 0),
  [dirEast]: new Vector(1, 0),
};
// TODO: Check if left and right are correct
const relativeAngles = {
  [dirFurther]: 0,
  [dirCloser]: Math.PI,
  [dirLeft]: 0.5 * Math.PI,
  [dirRight]: 1.5 * Math.PI,
};

function isCardinal(direction) {
  return [dirNorth, dirSouth, dirWest, dirEast].findIndex(direction) !== -1;
}

/* function isRelative(direction) {
  return !isCardinal(direction);
} */

export default function parseMapDistance(str) {
  if (str === '' || str === '0') {
    return {
      str: '0m',
      magnitude: 0,
      unit: unitMeter,
      direction: '',
      // eslint-disable-next-line no-unused-vars
      toMapVector(scale, refDirection) {
        return new Vector(0, 0);
      },
    };
  }

  const match = distanceRegExp.exec(str);

  if (!match) return null;

  const magnitude = parseInt(match[1], 10);
  const unit = !match[2] || match[2].match(unitMeterRegExp) ? unitMeter : unitKeyPad;
  const direction = dirs[dirRegExps.findIndex(d => match[3].match(d))];

  return {
    str: `${magnitude}${unit}${direction}`,
    magnitude,
    unit,
    direction,
    toMapVector(scale, refDirection) {
      const scaledMagnitude = unit === unitMeter ? magnitude / scale : magnitude * subKeySizeHMU;
      const absoluteDirection = isCardinal(direction)
        ? cardinalVectors(direction).clone()
        : refDirection.clone().rotate(relativeAngles(direction));

      return absoluteDirection.clone().mulS(scaledMagnitude);
    },
  };
}
