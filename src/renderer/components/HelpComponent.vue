<template>
  <div>
    <div class='level'>
      <div class='level-item'>
        <div id='help-hint'>
          <v-icon name='chevrons-down'/>
          <p>Scroll down for help</p>
        </div>
      </div>
    </div>
    <article>
      <VueShowdown
        class='is-size-7 has-backround-white'
        :markdown='this.source'
        :options='{tables: true}'
        :extensions='showdownExtensions'
      />
    </article>
  </div>
</template>

<script>
import { VueShowdown } from 'vue-showdown';
import help from '../assets/help.template.md';

import { allCommandTypes } from '../modules/command';
import {
  activatorKeyCodes,
  deactivatorKeyCodes,
  cancelKeyCodes,
  clearKeyCodes,
  rawCharToName,
} from '../modules/input.js';

// prettier-ignore
const commands = allCommandTypes.map(command => ({
  aliasList: `\`${command.aliases.join('` `')}\``,
  description: command.description,
  parameterType: command.paramType,
}));

const keys = {
  activatorKeyList: `\`${activatorKeyCodes
    .map(rawCharToName)
    .join('` or `')}\``,
  deactivatorKeyList: `\`${deactivatorKeyCodes
    .map(rawCharToName)
    .join('` or `')}\``,
  cancelKeyList: `\`${cancelKeyCodes.map(rawCharToName).join('` or `')}\``,
  clearKeyList: `\`${clearKeyCodes.map(rawCharToName).join('` or `')}\``,
};

const scope = Object.assign({}, commands, keys);

const classMap = {
  table: 'table',
  h1: 'title is-1',
  h2: 'title is-2',
  h3: 'title is-3',
  h4: 'title is-4',
  h5: 'title is-5',
  h6: 'title is-6',
};

// prettier-ignore
const bindings = Object.keys(classMap).map(key => ({
  type: 'output',
  regex: new RegExp(`<${key}(.*)>`, 'g'),
  replace: `<${key} class="${classMap[key]}" $1>`,
}));

export default {
  data() {
    return {
      source: help(scope),
      showdownExtensions: [bindings],
    };
  },
  components: {
    VueShowdown,
  },
};
</script>

<style lang="scss">
ul {
  list-style: disc;
  margin-left: 2em;
}

#help-hint {
  text-align: center;
}
</style>
