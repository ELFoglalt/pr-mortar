import { Vector } from 'vector2d';

import { directionFromVectors } from './utils';
import parseMapPoint from './map-point';
import parseMapDistance from './map-distance';

const paramTypePoint = 'point';
const paramTypeDistance = 'distance';

const commandTypeSTP = {
  aliases: ['sfp', 'fp', ','],
  description: 'Set Firing Position',
  paramType: paramTypePoint,
};
const commandTypeSFP = {
  aliases: ['sfp', 'fp', '+'],
  description: 'Set Target Position',
  paramType: paramTypePoint,
};
const commandTypeSTO = {
  aliases: ['sto', 'to', '/'],
  description: 'Set Target Offset',
  paramType: paramTypeDistance,
};
const commandTypeATO = {
  aliases: ['ato', 'a', '*'],
  description: 'Adjust Target Offset',
  paramType: paramTypeDistance,
};
const allCommandTypes = [commandTypeSTP, commandTypeSFP, commandTypeSTO, commandTypeATO];

function matchCommandToString(str, cmd) {
  return cmd.aliases.find(alias => str.startsWith(alias));
}

function identifyCommandType(str) {
  const matchedAliases = allCommandTypes.map(cmd => matchCommandToString(str, cmd));
  const idx = matchedAliases.findIndex(alias => alias !== undefined);

  if (idx === -1) return { commandType: null, paramStr: null };

  return { commandType: allCommandTypes[idx], paramStr: str.replace(matchedAliases[idx], '') };
}

function parseCommand(str) {
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
function applyCommand(state, command, prMap) {
  const newState = Object.assign({}, state);
  const { type, parameter } = command;

  if (command.unknownStr) {
    return newState;
  }

  if (type === commandTypeSTP) {
    newState.firingPosition = parameter.toMapVector();
  } else if (type === commandTypeSFP) {
    newState.targetPosition = parameter.toMapVector();
    newState.targetOffset = new Vector(0, 0);
  } else {
    const { firingPosition, targetPosition, toMapVector } = parameter;
    const refDirection = directionFromVectors(firingPosition, targetPosition);

    if (type === commandTypeSTO) {
      newState.targetOffset = toMapVector(prMap.metaData.scale[0], refDirection);
    } else if (type === commandTypeATO && newState.targetOffset !== null) {
      newState.targetOffset = newState.targetOffset
        .clone()
        .add(toMapVector(prMap.metaData.scale[0], refDirection));
    }
  }

  return newState;
}

export default { parseCommand, applyCommand };
