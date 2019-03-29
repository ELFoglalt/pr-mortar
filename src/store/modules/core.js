import { MapEvent } from '../../common/map-event';
import { backwardsSolve } from '../../renderer/modules/firing-solution';

function createEmptyHistory() {
  return [new MapEvent()];
}

const state = {
  prMap: null,
  mapEventHistory: createEmptyHistory(),
  activeEventIdx: 0,
  firingSolution: null,
};

const getters = {
  activeEvent(state) {
    return state.mapEventHistory[state.activeEventIdx];
  },
  firingSolution(state, getters) {
    const { firingPosition, targetPosition, targetOffset } = getters.activeEvent.state;
    if (firingPosition && targetPosition) {
      return backwardsSolve(
        state.prMap,
        firingPosition.mapVector,
        targetPosition.mapVector,
        targetOffset,
      );
    }
    return backwardsSolve(state.prMap, null, null, targetOffset);
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
    state.mapEventHistory.unshift(payload);
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
