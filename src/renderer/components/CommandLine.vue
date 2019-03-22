<template>
  <div>This is the CLI</div>
</template>

<script>
import iohook from 'iohook';

export default {
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isReceivingInput: false,
      commandBuffer: null,
    };
  },
  watch: {
    enabled(newVal) {
      if (!newVal) {
        iohook.stop();
      }
    },
  },
  created() {
    iohook.on('keydown', this.handleKeyEvent);

    iohook.start();
    iohook.stop();
    // iohook.registerShortcut([56], this.handleKeyEvent);
    // iohook.on('keydown', this.handleKeyDownEvent);
    // iohook.on('keyup', this.handleKeyUpEvent);
    iohook.start();
  },
  beforeDestroy() {
    iohook.stop();
  },
  methods: {
    doNothing() {
      console.log('nope');
    },
    handleKeyEvent(info) {
      const { keycode, rawcode } = info;
      const keyChar = String.fromCharCode(keycode);
      const rawChar = String.fromCharCode(rawcode);
      console.log({ keycode, keyChar, rawcode, rawChar }); // eslint-disable-line
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
