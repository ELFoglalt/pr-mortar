<template>
  <button
    @focus='clearFocus'
    class='button is-primary is-fullwidth'
    @click='onLoadMap'
  >{{mapDisplayName}}</button>
</template>

<script>
import remote from 'electron';
import { clearFocusMixin } from '../mixins/clearFocusMixin';

export default {
  data() {
    return {};
  },
  mixins: [clearFocusMixin],
  computed: {
    mapDisplayName() {
      const { prMap } = this.$store.state.core;
      return prMap ? `Map: ${prMap.mapName}` : 'Load map';
    },
  },
  methods: {
    onLoadMap() {
      remote.ipcRenderer.sendSync('prompt-map-dialog');
    },
  },
};
</script>

<style lang="scss" scoped>
.map-info {
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
}
</style>
