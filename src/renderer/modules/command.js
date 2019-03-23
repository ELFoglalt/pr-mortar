import { Vector } from 'vector2d';

import { directionFromPoints } from './utils';
import parseMapPoint from './map-point';
import parseMapDistance from './map-distance';

const paramTypePoint = 'point';
const paramTypeDistance = 'distance';

// TODO: Use RegExp for alias
const commandTypeSFP = {
  aliases: ['SFP', 'FP', '*'],
  description: 'Set Firing Position',
  paramType: paramTypePoint,
};
const commandTypeSTP = {
  aliases: ['STP', 'TP', ','],
  description: 'Set Target Position',
  paramType: paramTypePoint,
};
const commandTypeSTO = {
  aliases: ['STO', 'TO', '-'],
  description: 'Set Target Offset',
  paramType: paramTypeDistance,
};
const commandTypeATO = {
  aliases: ['ATO', 'A', '+'],
  description: 'Adjust Target Offset',
  paramType: paramTypeDistance,
};
const allCommandTypes = [commandTypeSTP, commandTypeSFP, commandTypeSTO, commandTypeATO];

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
    newState.targetPosition = parameter.toMapVector();
  } else if (commandType === commandTypeSFP) {
    newState.firingPosition = parameter.toMapVector();
    newState.targetOffset = new Vector(0, 0);
  } else {
    const { firingPosition, targetPosition, toMapVector } = parameter;

    if (!firingPosition || !targetPosition) return null;

    const refDirection = directionFromPoints(firingPosition, targetPosition);

    if (commandType === commandTypeSTO) {
      newState.targetOffset = toMapVector(prMap.metaData.scale[0], refDirection);
    } else if (commandType === commandTypeATO && newState.targetOffset !== null) {
      newState.targetOffset = newState.targetOffset
        .clone()
        .add(toMapVector(prMap.metaData.scale[0], refDirection));
    }
  }

  return newState;
}

export default { parseCommand, applyCommand };
