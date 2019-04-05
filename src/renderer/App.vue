<template>
  <div id='app' class='container'>
    <MapInfo/>
    <!-- <Options/> -->
    <FiringComputer/>
    <CommandLine/>
  </div>
</template>

<script>
import MapInfo from '@/components/MapInfo';
import Options from '@/components/Options';
import FiringComputer from '@/components/FiringComputer';
import CommandLine from '@/components/CommandLine';

export default {
  name: 'pr-mortar',
  components: {
    MapInfo,
    Options,
    FiringComputer,
    CommandLine,
  },
};
</script>

<style lang="scss">
body {
  height: 100vh;
  margin: 0;
  -ms-overflow-style: scrollbar;
  -webkit-app-region: drag;
}

input[type='submit'],
input[type='reset'],
input[type='button'],
input[type='text'],
button,
textarea {
  -webkit-app-region: no-drag;
}

#app {
  height: inherit;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.icon {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
