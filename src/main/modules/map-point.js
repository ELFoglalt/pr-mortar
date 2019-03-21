import { Vector } from 'vector2d';

import { subKeySizeHMU, gridSizeHMU } from './map-constants';

const groupGridAlf = '[A-NZ]';
const groupGridNum = '[0-9]{1,2}';
const groupKeypad = '[1-9]';
const sepSubKey = '[\\/k]';

const pointPattern = `(${groupGridAlf})(${groupGridNum})((${sepSubKey}${groupKeypad})*)`;

const pointRegExp = new RegExp(pointPattern, 'i');
const subKeyesRegExp = new RegExp(sepSubKey, 'g');

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

export default function MapPoint(str) {
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
