<template>
  <div>This is the CLI</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isActive: false,
      commandBuffer: null,
    };
  },
  computed: {
    isRecording() {
      return this.isEnabled && this.isActive;
    },
    keyboardEvent() {
      return this.$store;
    },
  },
  watch: {
    keyboardEvent(event) {
      // TODO Continue here :)
      console.log(event);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
