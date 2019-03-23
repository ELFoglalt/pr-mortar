import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron'; // eslint-disable-line

import keyboardInput from './modules/keyboardInput';
import mapState from './modules/mapState';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    keyboardInput,
    mapState,
  },
  plugins: [/* createPersistedState(), */ createSharedMutations()], // eslint-disable-line
  strict: process.env.NODE_ENV !== 'production',
});
