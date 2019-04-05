export const clearFocusMixin = {
  methods: {
    clearFocus() {
      document.activeElement.blur();
    },
  },
};

export default { clearFocusMixin };
