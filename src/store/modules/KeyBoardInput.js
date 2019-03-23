// import input from '../../common/input';

const state = {
  keyboardEvent: null,
};

const mutations = {
  mPushKeyboardEvent(state, { event }) {
    state.keyboardEvent = event;
  },
};

const actions = {
  aPushKeyboardEvent({ commit }, payload) {
    commit('mPushKeyboardEvent', payload);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
