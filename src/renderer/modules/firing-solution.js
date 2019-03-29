import { Vector } from 'vector2d';
import ndarray from 'ndarray';
import { lookAtVector, vectorDistance } from './utils';

// This function returns continous height info from the discrete heightmap,
// at continous coordinates.
function subsampleHeightmap(heightmap, coordinates) {
  const { x, y } = coordinates.toObject();
  const [dimX, dimY] = heightmap.shape;

  const xLow = Math.min(dimX, Math.max(0, Math.floor(x)));
  const xHigh = Math.min(dimX, Math.max(0, Math.ceil(x)));
  const yLow = Math.min(dimY, Math.max(0, Math.floor(y)));
  const yHigh = Math.min(dimY, Math.max(0, Math.ceil(y)));

  if (
    xLow < 0 ||
    xLow >= dimX ||
    yLow < 0 ||
    yLow >= dimY ||
    xHigh < 0 ||
    xHigh >= dimX ||
    yHigh < 0 ||
    yHigh >= dimY
  ) {
    return null; // Point outside of map
  }

  const distanceTopLeft = vectorDistance(new Vector(xLow, yLow), coordinates);
  const distanceBotLeft = vectorDistance(new Vector(xLow, yHigh), coordinates);
  const distanceTopRight = vectorDistance(new Vector(xHigh, yLow), coordinates);
  const distanceBotRight = vectorDistance(new Vector(xHigh, yHigh), coordinates);

  const heightTopLeft = heightmap.get(xLow, yLow);
  const heightBotLeft = heightmap.get(xLow, yHigh);
  const heightTopRight = heightmap.get(xHigh, yLow);
  const heightBotRight = heightmap.get(xHigh, yHigh);

  // The quads on the heightmap are turned into in-game geomtery by
  // triangulating in the direction of SE.
  // The actual height will be a distance weighed average of the
  // points definind the triangle the target falls within.

  // prettier-ignore
  let interpDistance = (distanceTopLeft * heightTopLeft) + (distanceBotRight * heightBotRight);
  let norm = distanceTopLeft + distanceBotRight;

  if (distanceBotLeft < distanceTopRight) {
    interpDistance += distanceBotLeft * heightBotLeft;
    norm += distanceBotLeft;
  } else {
    interpDistance += distanceTopRight * heightTopRight;
    norm += distanceTopRight;
  }
  interpDistance /= norm;

  return interpDistance;
}

// Calculates firing elevation (in PR mils) from a distance vector, and an elevation
// given *in meters*.
function calcualteBarrelElevation(distanceXY, distanceZ) {
  const v0 = 150; // speed of the mortar rounds in m/s
  const ag = -15; // shell acceleration in m/s^2

  // We simply solve a quadratic formula to get the firing angle
  const a = 0.5 * ag * (distanceXY ** 2) / (v0 ** 2); // prettier-ignore
  const b = distanceXY;
  const c = a - distanceZ;

  const res = (b ** 2) - (4 * a * c); // prettier-ignore
  if (res < 0) {
    return null; // Target is out of range
  }

  const root1 = (-b + Math.sqrt(res)) / (2 * a); // prettier-ignore
  const root2 = (-b - Math.sqrt(res)) / (2 * a); // prettier-ignore

  const rad1 = Math.atan(root1);
  const rad2 = Math.atan(root2);

  // From rad to deg: *180/PI, from deg to PR mils: /45*800
  // Practically, in PR PI === 3.2, for some reason :D
  const radToMil = 3200 / Math.PI;
  const milMin = 800; // Lowest PR allows you to aim
  const milMax = 1575; // Highest PR allows you to aim

  const mil1 = radToMil * rad1;
  const mil2 = radToMil * rad2;

  if (mil1 < milMax && mil1 >= milMin) {
    return Math.round(mil1);
  } else if (mil2 < milMax && mil2 >= milMin) {
    return Math.round(mil2);
  }

  return null; // Target too close
}

function angleFromVector(dir) {
  const { x, y } = dir.toObject();
  return (Math.atan2(y, x) / Math.PI) * 180;
}

function calcualteBarrelDeflection(firingPoint, targetPoint) {
  const angle = angleFromVector(lookAtVector(firingPoint, targetPoint)) + 90;
  return Math.round(angle >= 0 ? angle : angle + 360);
}

// Calcualtes deflection and elevation from two XY points and a map.
export function backwardsSolve(prMap, firingPoint, targetPoint, targetOffset) {
  if (prMap === null || firingPoint === null || targetPoint === null) {
    return null; // Incomplete data, no solution.
  }
  const firingPointVec = new Vector(firingPoint.x, firingPoint.y);
  const targetPointVec = new Vector(targetPoint.x + targetOffset.x, targetPoint.y + targetOffset.y);

  // Calcualte distance and elevation in meters
  const distanceXY = vectorDistance(firingPointVec, targetPointVec) * prMap.metaData.scale[0];

  const heightDataNdarray = ndarray(
    prMap.heightData.data,
    prMap.heightData.shape,
    prMap.heightData.stride,
    prMap.heightData.offset,
  );

  const firingPointZ = subsampleHeightmap(heightDataNdarray, firingPointVec);
  const targetPointZ = subsampleHeightmap(heightDataNdarray, targetPointVec);

  if (firingPointZ === null || targetPointZ === null) {
    return null; // One of the points is outside of the map, no solution.
  }

  const distanceZ = targetPointZ - firingPointZ;

  const elevation = calcualteBarrelElevation(distanceXY, distanceZ);
  const deflection = calcualteBarrelDeflection(firingPointVec, targetPointVec);

  return { elevation, deflection };
}

export default { backwardsSolve };
