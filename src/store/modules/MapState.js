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
  firingSolution() {},
};

const mutations = {
  mLoadMap(state, payload) {
    state.prMap = payload.prMap;
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

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};
