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

const M_LOAD_MAP = 'M_LOAD_MAP';
const M_UNLOAD_MAP = 'M_UNLOAD_MAP';
const M_ADD_EVENT = 'M_ADD_EVENT';
const M_CLEAR_EVENT_HISTORY = 'M_CLEAR_EVENT_HISTORY';
const M_UNDO_EVENT = 'M_UNDO_EVENT';
const M_REDO_EVENT = 'M_REDO_EVENT';

const mutations = {
  [M_LOAD_MAP](state, payload) {
    state.prMap = payload.prMap;
  },
  [M_UNLOAD_MAP](state) {
    state.prMap = null;
    state.mapEventHistory = createEmptyHistory();
    state.activeEventIdx = 0;
  },
  [M_ADD_EVENT](state, payload) {
    // discard "newer" commands from history
    if (state.activeEventIdx !== 0) {
      state.mapEventHistory = state.mapEventHistory.slice(state.activeEventIdx);
      state.activeEventIdx = 0;
    }
    state.mapEventHistory.unshift(payload.command);
  },
  [M_CLEAR_EVENT_HISTORY](state) {
    state.mapEventHistory = createEmptyHistory();
    state.commandIdx = 0;
  },
  [M_UNDO_EVENT](state) {
    if (state.activeEventIdx < state.mapEventHistory.length - 1) {
      state.activeEventIdx += 1;
    }
  },
  [M_REDO_EVENT](state) {
    if (state.activeEventIdx > 0) {
      state.activeEventIdx -= 1;
    }
  },
};

export const mutationTypes = {
  UNLOAD_MAP: M_UNLOAD_MAP,
  ADD_EVENT: M_ADD_EVENT,
  CLEAR_EVENT_HISTORY: M_CLEAR_EVENT_HISTORY,
  UNDO_EVENT: M_UNDO_EVENT,
  REDO_EVENT: M_REDO_EVENT,
};

export const actionTypes = {};

export default {
  state,
  getters,
  mutations,
};
