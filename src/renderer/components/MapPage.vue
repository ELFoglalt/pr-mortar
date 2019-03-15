<template>
  <div id='wrapper'>
    <map-view/>
    <command-line/>
  </div>
</template>

<script>
import CommandLine from './MapPage/CommandLine';
import MapView from './MapPage/MapView';

export default {
  name: 'map-page',
  components: { CommandLine, MapView },
};
</script>

<style lang='scss' scoped>
#wrapper {
  height: 100%;
}
</style>
