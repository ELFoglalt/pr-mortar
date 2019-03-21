const { Vector } = require('vector2d'); // import { Vector } from 'vector2d';

function mergeRegGroup(...args) {
  const stripped = args.map(group =>
    (group && group[0] === '[' ? group.substr(1, group.length - 2) : group));
  return `[${stripped.join('')}]`;
}

const groupGridAlf = '[A-NZ]';
const groupGridNum = '[0-9]{1,2}';
const groupInt = '[0-9]+';
const groupKeypad = '[1-9]';
const unitMeter = 'm';
const unitKeypad = '[\\/k]';
const groupUnit = mergeRegGroup(unitMeter, unitKeypad);
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

const pointPattern = `(${groupGridAlf})(${groupGridNum})((${sepSubKey}${groupKeypad})*)`;
const distancePattern = `(${groupInt})(${groupUnit})?(${groupDirection})`;

const pointRegExp = new RegExp(pointPattern, 'i');
const distanceRegExp = new RegExp(distancePattern, 'i');
const subKeyesRegExp = new RegExp(sepSubKey, 'g');

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

// QUESTION: Convert to matchToPoint, make separate funciton that parses input?
function stringToPoint(str) {
  const match = pointRegExp.exec(str);
  if (!match) return null;

  const gridPoint = new Vector(gridAlfToNum(match[1]), parseInt(match[2], 10));
  const gridSubKeyes = match[3]
    .split(subKeyesRegExp)
    .filter(Boolean)
    .map(s => parseInt(s, 10));
  const offset = subKeyesToGridPoint(gridSubKeyes);

  // X, Y calc maybe not here? See above ^
  const gridPointHMU = gridPoint.clone().add(offset);

  return {
    str,
    gridPoint,
    gridSubKeyes,
    gridPointHMU,
  };
}

function stringToDistance(str) {
  const match = distanceRegExp.exec(str);
  if (!match) return null;
}

console.log(stringToPoint('A7k3')); // eslint-disable-line
