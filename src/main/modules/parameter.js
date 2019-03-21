const { Vector } = require('vector2d'); // import { Vector } from 'vector2d';

function mergeRegGroup(...args) {
  const stripped = args.map(group =>
    (group && group[0] === '[' ? group.substr(1, group.length - 2) : group));
  return `[${stripped.join('')}]`;
}

const groupGridAlf = '[A-NZ]';
const groupGridNum = '[0-9]{1,2}';
const groupInt = '[0-9]+';
const groupKeyPad = '[1-9]';
const unitMeter = 'm';
const unitKeyPad = '[\\/k]';
const groupUnit = mergeRegGroup(unitMeter, unitKeyPad);
const dirNorth = 'N';
const dirSouth = 'S';
const dirWest = 'W';
const dirEast = 'E';
const groupCardinal = mergeRegGroup(dirNorth, dirSouth, dirWest, dirEast);
const dirFurther = 'F';
const dirCloser = 'C';
const dirLeft = 'L';
const dirRight = 'R';
const groupRelative = mergeRegGroup(dirFurther, dirCloser, dirLeft, dirRight);
const groupDirection = mergeRegGroup(groupCardinal, groupRelative);
const sepSubKey = '[\\/k]';

const pointPattern = `(${groupGridAlf})(${groupGridNum})((${sepSubKey}${groupKeyPad})*)`;
const distancePattern = `(${groupInt})(${groupUnit})?(${groupDirection})`;

const pointRegExp = new RegExp(pointPattern, 'i');
const distanceRegExp = new RegExp(distancePattern, 'i');
const subKeyesRegExp = new RegExp(sepSubKey, 'g');
const unitMeterRegExp = new RegExp(unitMeter, 'i');
// const unitSubKeyRegExp = new RegExp(unitMeter, 'i');

const dirs = [dirNorth, dirSouth, dirWest, dirEast, dirFurther, dirCloser, dirLeft, dirRight];
const dirRegExps = dirs.map(dir => new RegExp(dir, 'i'));

const subKeySizeHMU = 25;
const gridSizeHMU = subKeySizeHMU * 3;

function gridAlfToNum(alf) {
  const alfuc = alf.toUpperCase();
  if (alfuc === 'Z') return 0;
  return alfuc.charCodeAt() - 'A'.charCodeAt() + 1;
}

function subKeyToGridPoint(keyPad) {
  keyPad -= 1;
  const keyPadX = keyPad % 3;
  const keyPadY = 2 - Math.floor(keyPad / 3);
  const gridPoint = new Vector(keyPadX, keyPadY);
  gridPoint.add(new Vector(0.5, 0.5)).divS(3);
  return gridPoint;
}

function subKeyesToGridPoint(keyPads) {
  if (!keyPads || keyPads.length === 0) {
    keyPads = [5];
  }

  const gridPoint = subKeyToGridPoint(keyPads[0]);
  let subKey = 3.0;
  for (let i = 1; i < keyPads.length; i += 1) {
    const offset = subKeyToGridPoint(keyPads[i]);
    offset.subtract(new Vector(0.5, 0.5)).divS(subKey);
    gridPoint.add(offset);
    subKey *= 3;
  }

  return gridPoint;
}

function gridPointToHMU(gridPoint) {
  const scaledPoint = gridPoint.clone().mulS(gridSizeHMU);
  const offset = -subKeySizeHMU * 2;
  return gridPoint
    .clone()
    .mulS(gridSizeHMU)
    .add(new Vector(offset, offset));
}

function MapPoint(str) {
  const match = pointRegExp.exec(str);

  if (!match) return null;

  const gridPoint = new Vector(gridAlfToNum(match[1]), parseInt(match[2], 10));
  const gridSubKeyes = match[3]
    .split(subKeyesRegExp)
    .filter(Boolean)
    .map(s => parseInt(s, 10));

  return {
    str,
    gridPoint,
    gridSubKeyes,
    toHMU() {
      return gridPoint.clone().add(subKeyesToGridPoint(gridSubKeyes));
    },
  };
}

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

function Distance(str) {
  const match = distanceRegExp.exec(str);

  if (!match) return null;

  const magnitude = parseInt(match[1], 10);
  const unit = !match[2] || match[2].match(unitMeterRegExp) ? unitMeter : unitKeyPad;
  const direction = dirs[dirRegExps.findIndex(d => match[3].match(d))];

  return {
    magnitude,
    unit,
    direction,
    toHMU(scale, refDirection) {
      const scaledMagnitude = unit === unitMeter ? magnitude / scale : magnitude * subKeySizeHMU;
      const absoluteDirection = isCardinal(direction)
        ? cardinalVectors(direction).clone()
        : refDirection.clone().rotate(relativeAngles(direction));

      return absoluteDirection.clone().mulS(scaledMagnitude);
    },
  };
}

console.log(Distance('70mE')); // eslint-disable-line
