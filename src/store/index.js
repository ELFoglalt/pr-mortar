import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';

import { types, modules } from './modules';

export const storeTypes = types;

Vue.use(Vuex);

export default new Vuex.Store({
  modules,
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production',
});
