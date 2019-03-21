const cmdSTP = { aliases: ['sfp', 'fp', ','], description: 'Set Firing Position' };
const cmdSFP = { aliases: ['sfp', 'fp', '+'], description: 'Set Target Position' };
const cmdSTO = { aliases: ['sto', 'to', '/'], description: 'Set Target Offset' };
const cmdATO = { aliases: ['ato', 'a', '*'], description: 'Add Target Offset' };
const allCommands = [cmdSTP, cmdSFP, cmdSTO, cmdATO];

function match(str, cmd) {
  return cmd.aliases.find(alias => str.startsWith(alias));
}

function commandFromString(str) {
  const matchedAliases = allCommands.map(cmd => match(str, cmd));
  const idx = matchedAliases.findIndex(alias => alias !== undefined);
  return idx === -1
    ? { command: allCommands[idx], rest: str.replace(matchedAliases[idx], '') }
    : null;
}
