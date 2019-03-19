<template>
  <div id='wrapper'>
    <map-view/>
    <command-line/>
  </div>
</template>

<script>
import * as ioHook from 'iohook';
import * as robotjs from 'robotjs'; // eslint-disable-line
import { remote } from 'electron';
import CommandLine from './CommandLine';
import MapView from './MapView';

export default {
  name: 'test-page',
  components: { CommandLine, MapView },
  data() {
    return { mousex: 0, mousey: 0 };
  },
  mounted() {
    ioHook.on('mouseclick', this.handleMouseClick);
    ioHook.on('mousemove', this.handleMouseMove);
    ioHook.start();

    setInterval(this.logMousePos, 200);
  },
  beforeDestroy() {
    ioHook.stop();

    clearInterval(this.logMousePos);
  },
  methods: {
    handleMouseMove(event) {
      this.mousex = event.x;
      this.mousey = event.y;
    },
    handleMouseClick(event) {
      console.log(event); // eslint-disable-line

      robotjs.moveMouse(51, 51);
      robotjs.moveMouseSmooth(0, 0);
    },
    logMousePos() {
      console.log({ x: this.mousex, y: this.mousey }); // eslint-disable-line
    },
  },
};
</script>

<style lang='scss' scoped>
#wrapper {
  height: 100%;
}
</style>
