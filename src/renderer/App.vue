<template>
  <div id='app'>
    <Options/>
    <CommandLine/>
  </div>
</template>

<script>
import CommandLine from '@/components/CommandLine';
import Options from '@/components/Options';

export default {
  name: 'pr-mortar',
  components: {
    CommandLine,
    Options,
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
