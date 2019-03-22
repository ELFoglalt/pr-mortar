<template>
  <div>This is the CLI</div>
</template>

<script>
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
    enabled(newVal) {},
  },
  created() {
    console.log(this.$store);
  },
  beforeDestroy() {},
  methods: {
    doNothing() {
      console.log('nope'); // eslint-disable-line
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
