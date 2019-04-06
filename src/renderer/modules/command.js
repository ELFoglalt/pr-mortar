import { Vector } from 'vector2d';

import { lookAtDirection } from './utils';
import parseMapPoint from './map-point';
import parseMapDistance from './map-distance';

const paramTypePoint = '`<Point>`';
const paramTypeDistance = '`<Distance>`';

// TODO: Use RegExp for alias
export const commandTypeSFP = {
  aliases: ['SFP', 'FP', '/'],
  description: 'Set Firing Position',
  paramType: paramTypePoint,
};
export const commandTypeSTP = {
  aliases: ['STP', 'TP', '*'],
  description: 'Set Target Position',
  paramType: paramTypePoint,
};
export const commandTypeSTO = {
  aliases: ['STO', 'TO', '-'],
  description: 'Set Target Offset',
  paramType: paramTypeDistance,
};
export const commandTypeATO = {
  aliases: ['ATO', 'A', '+'],
  description: 'Adjust Target Offset',
  paramType: paramTypeDistance,
};
export const allCommandTypes = [commandTypeSTP, commandTypeSFP, commandTypeSTO, commandTypeATO];

function matchCommandToString(str, cmd) {
  const stru = str.toUpperCase();
  return cmd.aliases.find(alias => stru.startsWith(alias));
}

function identifyCommandType(str) {
  const matchedAliases = allCommandTypes.map(cmd => matchCommandToString(str, cmd));
  const idx = matchedAliases.findIndex(alias => alias !== undefined);

  if (idx === -1) return { commandType: null, paramStr: null };

  return { commandType: allCommandTypes[idx], paramStr: str.replace(matchedAliases[idx], '') };
}

export function parseCommand(str) {
  const result = {
    inputStr: str,
    commandType: null,
    parameter: null,
    unknownStr: str,
  };

  // Parse command type
  const { commandType, paramStr } = identifyCommandType(str);

  if (commandType === null) return result;

  result.commandType = commandType;
  result.unknownStr = paramStr;

  // Parse parameter
  const parameter =
    commandType.paramType === paramTypePoint ? parseMapPoint(paramStr) : parseMapDistance(paramStr);

  if (parameter === null) return result;

  result.parameter = parameter;
  result.unknownStr = null;
  result.valid = true;

  return result;
}

// This 'one-function-does-all' solution is quick and dirty. If new commands
// ever get added, this should be refactored big time.
export function applyCommand(state, command, prMap) {
  const newState = Object.assign({}, state);
  const { commandType, parameter } = command;

  if (command.unknownStr) {
    return null;
  }

  if (commandType === commandTypeSTP) {
    newState.targetPosition = parameter;
    newState.targetOffset = { x: 0, y: 0 };
  } else if (commandType === commandTypeSFP) {
    newState.firingPosition = parameter;
  } else {
    const { firingPosition, targetPosition } = newState;
    const { toMapVector } = parameter;

    if (!firingPosition || !targetPosition) return null;

    const refDirection = lookAtDirection(
      new Vector(firingPosition.mapVector.x, firingPosition.mapVector.y),
      new Vector(targetPosition.mapVector.x, targetPosition.mapVector.y),
    );

    if (commandType === commandTypeSTO) {
      newState.targetOffset = toMapVector(prMap.metaData.scale[0], refDirection).toObject();
    } else if (commandType === commandTypeATO && newState.targetOffset !== null) {
      newState.targetOffset = new Vector(newState.targetOffset.x, newState.targetOffset.y)
        .add(toMapVector(prMap.metaData.scale[0], refDirection))
        .toObject();
    }
  }

  return newState;
}

export default { parseCommand, applyCommand };
