#### How to use this app

- **Load a map by selecting the appropriate folder in your PRBF2 levels directory.** For example, to load Dovre Winter one would select the folder \`<...>\\Project Reality BF2\\mods\\pr\\levels\\dovre_winter\`.
- **To start issuing a command, press** ${scope.activatorKeyList}. Then first type a command, followed by it's parameter. You can use ${scope.clearKeyList} to clear parts of the command. Hit ${scope.deactivatorKeyList} to confirm a command. Cancel an unwanted command with using ${scope.cancelKeyList}.
- **Any of the strings listed in the command reference may be used to issue a given command**, meaning that \`SFPA4\`, \`FPA4\` and \`/A4\` are all valid commands, and all of them set the firing position to the center of A4.
- **Enable text-to-speech readouts** using the audio unmute buttons by the elevation and deflection indicators.


------

#### Commands

| Command               | Name                    | Parameter Type            | Description                                                             | Examples                |
| --------------------- | ----------------------- | ------------------------- | ----------------------------------------------------------------------- | ----------------------- |
| ${scope[0].aliasList} | ${scope[0].description} | ${scope[0].parameterType} | Places the firing position at a given coordinate.                       | \`/E7/1/4\`, \`STPA4\`  |
| ${scope[1].aliasList} | ${scope[1].description} | ${scope[1].parameterType} | Places the target position at a given coordinate. Clears target offset. | \`\*E7/1/4\`, \`SFPA4\` |
| ${scope[2].aliasList} | ${scope[2].description} | ${scope[2].parameterType} | Sets the target offset to a given distance.                             | \`-100mE\`, \`STO50mL\` |
| ${scope[3].aliasList} | ${scope[3].description} | ${scope[3].parameterType} | Adds a given distance to the current target offset.                     | \`+100mE\`, \`ATO50mL\` |


------

#### Parameters

| Parameter type  | Format                                                 | Description                                                                   | Examples            |
| --------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------- |
| \`<Point>\`     | \`<GLetter><GNum>[/<GKey1>[/<GKey2>...]]\`             | A grid point on the map.                                                      | \`E7/1/4\`, \`A4\`  |
| \`<Distance>\`  | \`<Number>[<Unit>]<Direction>\`                        | A non-negative distance on the map.                                           | \`100mE\`, \`50mL\` |
| \`<GLetter>\`   | \`A-N\` or \`Z\`                                       | A letter identifying a grid column. \`Z\` comes before \`A\`.                 |                     |
| \`<GNum>\`      | \`0-14\`                                               | A letter identifying a grid row.                                              |                     |
| \`<GKey>\`      | \`1-9\`                                                | A single number representing a keypad.                                        |                     |
| \`<Unit>\`      | \`M\` or \`/\`                                         | In-game meters \`M\`, or keypads \`/\`.                                       |                     |
| \`<Direction>\` | \`N\`, \`W\`, \`S\`, \`E\`, \`F\`, \`C\`, \`L\`, \`R\` | Cardinal: North, West, East, South; Relative: Further, Closer, Left or Right. |                     |
