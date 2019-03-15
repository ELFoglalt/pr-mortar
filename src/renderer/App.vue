<template>
  <div id='app'>
    <map-page></map-page>
  </div>
</template>

<script>
import MapPage from '@/components/MapPage';

export default {
  name: 'pr-mortar',
  components: {
    MapPage,
  },
};
</script>

<style lang="scss">
body {
  height: 100vh;
  margin: 0;
}

#app {
  height: inherit;
  width: 100%;
}
</style>
