const someModule = {
  state: {
    A: {},
    B: [],
  },
  mutations: {
    CLEAR_A(state) {
      state.A = [];
    },
    MUTATE_B(state, payload) {
      state.B = payload.B;
      // state.A = []; // Also has to happen, otherwise state is inconsistent.
      // Do we just trust people that if the ever write an a action that does
      // context.commit('MUTATE_B');, they will also write context.commit('MUTATE_A');?
      // Or do I replicate the code inside CLEAR_A?
    },
  },
  actions: {
    // Sometimes this has to happen
    updateA(context) {
      context.commit('CLEAR_A');
    },
    updateB(context) {
      context.commit('MUTATE_B');
      // If MUTATE_B happens, MUTATE_A always has to happen
      context.commit('MUTATE_A');
    },
  },
};
