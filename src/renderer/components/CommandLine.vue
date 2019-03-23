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
      return this.$store.state.KeyboardInput.keyboardEvent;
    },
  },
  watch: {
    keyboardEvent(event) {
      console.log(event);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
