import input from '../../common/input';

const state = {
  keyboardEvent: null,
};

const M_PUSH_KEYBOARD_EVENT = 'M_PUSH_KEYBOARD_EVENT';

const mutations = {
  [M_PUSH_KEYBOARD_EVENT](event) {
    state.keyboardEvent = event;
  },
};

const A_PUSH_KEYBOARD_EVENT = 'A_PUSH_KEYBOARD_EVENT';

const actions = {
  [A_PUSH_KEYBOARD_EVENT]({ commit }) {
    commit(M_PUSH_KEYBOARD_EVENT);
  },
};

export const mutationTypes = { M_PUSH_KEYBOARD_EVENT };

export const actionTypes = { A_PUSH_KEYBOARD_EVENT };

export default {
  state,
  mutations,
  actions,
};
