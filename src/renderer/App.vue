<template>
  <div id='app' class='container'>
    <!-- <div id='header'></div> -->
    <div id='content'>
      <!-- <div id='top-bar'> -->
      <MapInfo/>
      <!-- <ExitButton/> -->
      <!-- </div> -->
      <FiringComputer/>
      <CommandLine/>
      <HelpComponent/>
    </div>
  </div>
</template>

<script>
import MapInfo from '@/components/MapInfo';
import ExitButton from '@/components/ExitButton';
import FiringComputer from '@/components/FiringComputer';
import CommandLine from '@/components/CommandLine';
import HelpComponent from '@/components/HelpComponent';

export default {
  name: 'pr-mortar',
  components: {
    MapInfo,
    ExitButton,
    FiringComputer,
    CommandLine,
    HelpComponent,
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
  display: flex;
  flex-direction: column;
}

#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 24px;
  -webkit-app-region: drag;
}

#content {
  // margin-top: 24px;
  overflow-x: scroll;
  padding: 24px;
}

#top-bar {
  display: flex;
  flex-direction: row;
  :last-child {
    margin-left: 10px;
  }
  min-height: 36px;
}

.icon {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
