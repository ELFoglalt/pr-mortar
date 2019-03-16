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
  name: 'map-page',
  components: { CommandLine, MapView },
};
</script>

<style lang='scss' scoped>
#wrapper {
  height: 100%;
}
</style>
