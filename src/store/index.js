import Vue from 'vue';
import Vuex from 'vuex';

import { createPersistedState, createSharedMutations } from 'vuex-electron';

import { types, modules } from './modules';

export const storeTypes = types;

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules,
  plugins: [createPersistedState(), createSharedMutations()],
  strict: process.env.NODE_ENV !== 'production',
});

export default { storeTypes, store };
