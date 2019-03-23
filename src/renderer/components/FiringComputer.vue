<template>
  <div class='wrapper'>
    <div>Firing Position</div>
    <div>Target Position</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters('core', ['activeEvent']),
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>
