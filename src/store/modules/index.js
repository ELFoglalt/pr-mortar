/**
 * The file enables `@/store/index.js` to import all vuex modules
 * in a one-shot manner. There should not be any reason to edit this file.
 */

const files = require.context('.', false, /\.js$/);
const modules = {};
let mutationTypes = {};
let actionTypes = {};

files.keys().forEach((key) => {
  if (key === './index.js') return;
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default;
  if (files(key).mutationTypes) mutationTypes = { ...mutationTypes, ...files(key).mutationTypes };
  if (files(key).actionTypes) actionTypes = { ...actionTypes, ...files(key).actionTypes };
});

export const types = { mutationTypes, actionTypes };

export default modules;
