// import input from '../../common/input';

const state = {
  keyboardEvent: null,
};

const M_PUSH_KEYBOARD_EVENT = 'M_PUSH_KEYBOARD_EVENT';

const mutations = {
  [M_PUSH_KEYBOARD_EVENT](state, { event }) {
    state.keyboardEvent = event;
  },
};

const A_PUSH_KEYBOARD_EVENT = 'A_PUSH_KEYBOARD_EVENT';

const actions = {
  [A_PUSH_KEYBOARD_EVENT]({ commit }, payload) {
    commit(M_PUSH_KEYBOARD_EVENT, payload);
  },
};

export const mutationTypes = { M_PUSH_KEYBOARD_EVENT };

export const actionTypes = { A_PUSH_KEYBOARD_EVENT };

export default {
  namespace: '',
  state,
  mutations,
  actions,
};
