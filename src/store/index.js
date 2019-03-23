import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron'; // eslint-disable-line

import keyboardInput from './modules/keyboardInput';
import core from './modules/core';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    keyboardInput,
    core,
  },
  plugins: [/* createPersistedState(), */ createSharedMutations()], // eslint-disable-line
  strict: process.env.NODE_ENV !== 'production',
});
