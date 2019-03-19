<template>
  <div id='app'>
    <test-page></test-page>
  </div>
</template>

<script>
import TestPage from '@/components/TestPage';

export default {
  name: 'pr-mortar',
  components: {
    TestPage,
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
