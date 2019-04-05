<template>
  <div id='app' class='container'>
    <div id='header'></div>
    <span id='top-bar'>
      <MapInfo/>
      <ExitButton/>
    </span>
    <FiringComputer/>
    <CommandLine/>
  </div>
</template>

<script>
import MapInfo from '@/components/MapInfo';
import ExitButton from '@/components/ExitButton';
import FiringComputer from '@/components/FiringComputer';
import CommandLine from '@/components/CommandLine';

export default {
  name: 'pr-mortar',
  components: {
    MapInfo,
    ExitButton,
    FiringComputer,
    CommandLine,
  },
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}

body {
  height: 100vh;
  margin: 0;
  -ms-overflow-style: none;
  user-select: none;
  cursor: default;
}

#app {
  height: inherit;
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
}

#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  -webkit-app-region: drag;
}

#top-bar {
  display: flex;
  flex-direction: row;
  :last-child {
    margin-left: 10px;
  }
}

.icon {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
