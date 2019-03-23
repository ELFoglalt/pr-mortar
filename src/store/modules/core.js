import { MapEvent } from '../../common/map-event';

function createEmptyHistory() {
  return [new MapEvent()];
}

const state = {
  prMap: null,
  mapEventHistory: createEmptyHistory(),
  activeEventIdx: 0,
};

const getters = {
  activeEvent() {
    return state.mapEventHistory[state.activeEventIdx];
  },
};

const mutations = {
  mLoadMap(state, payload) {
    state.prMap = payload.loadedMap;
  },
  mUnloadMap(state) {
    state.prMap = null;
    state.mapEventHistory = createEmptyHistory();
    state.activeEventIdx = 0;
  },
  mAddEvent(state, payload) {
    // discard "newer" commands from history
    if (state.activeEventIdx !== 0) {
      state.mapEventHistory = state.mapEventHistory.slice(state.activeEventIdx);
      state.activeEventIdx = 0;
    }
    state.mapEventHistory.unshift(payload.command);
  },
  mClearEventHistory(state) {
    state.mapEventHistory = createEmptyHistory();
    state.commandIdx = 0;
  },
  mUndoEvent(state) {
    if (state.activeEventIdx < state.mapEventHistory.length - 1) {
      state.activeEventIdx += 1;
    }
  },
  mRedoEvent(state) {
    if (state.activeEventIdx > 0) {
      state.activeEventIdx -= 1;
    }
  },
};

const actions = {
  async aLoadMap({ commit }, payload) {
    commit('mLoadMap', payload);
    commit('mClearEventHistory');
  },
  aAddEvent({ commit }, payload) {
    commit('mAddEvent', payload);
  },
  aClearEventHistory({ commit }) {
    commit('mClearEventHistory');
  },
  aUndoEvent({ commit }) {
    commit('mUndoEvent');
  },
  aRedoEvent({ commit }) {
    commit('mRedoEvent');
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
