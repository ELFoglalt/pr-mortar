<template>
  <div id='wrapper'>
    <map-view/>
    <command-line/>
  </div>
</template>

<script>
import CommandLine from './CommandLine';
import MapView from './MapView';

export default {
  components: { CommandLine, MapView },
  data() {
    return { mousex: 0, mousey: 0 };
  },
  methods: {
    logKeyboardEvent(event) {
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
