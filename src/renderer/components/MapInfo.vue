<template>
  <div class='map-info'>
    <button class='button is-primary is-fullwidth' @click='onLoadMap'>{{mapDisplayName}}</button>
  </div>
</template>

<script>
import remote from 'electron';

export default {
  data() {
    return {};
  },
  computed: {
    mapDisplayName() {
      const { prMap } = this.$store.state.core;
      return prMap ? prMap.mapName : 'Load map';
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
