<template>
  <button
    title='Exit the app'
    @click='exitApp'
    @focus='clearFocus'
    class='button is-primary is-danger'
  >
    <v-icon name='power'/>
  </button>
</template>

<script>
import { remote } from 'electron';
import { clearFocusMixin } from '../mixins/clearFocusMixin';

export default {
  data() {
    return {};
  },
  mixins: [clearFocusMixin],
  methods: {
    exitApp() {
      const window = remote.getCurrentWindow();
      window.close();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
