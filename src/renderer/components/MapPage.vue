<template>
  <div id='wrapper'>
    <map-view/>
    <command-line/>
  </div>
</template>

<script>
import * as ioHook from 'iohook';
import CommandLine from './CommandLine';
import MapView from './MapView';

export default {
  name: 'map-page',
  components: { CommandLine, MapView },
  mounted() {
    ioHook.on('mouseclick', this.handleMouseEvent);
    ioHook.start();
  },
  beforeDestroy() {
    ioHook.stop();
  },
  methods: {
    handleMouseEvent: (event) => {
      console.log(event); // eslint-disable-line
    },
  },
};
</script>

<style lang='scss' scoped>
#wrapper {
  height: 100%;
}
</style>
