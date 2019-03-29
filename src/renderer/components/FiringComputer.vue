<template>
  <div class='wrapper'>
    <div>Firing Position: {{ firingPositionText }}</div>
    <div>Target Position: {{ targetPositionText }}</div>
    <div>Target offset: {{ targetOffsetText }}</div>
    <div>Elevation: {{ elevationText }}</div>
    <div>Deflection: {{ deflectionText }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    activeEvent() {
      return this.$store.getters['core/activeEvent'];
    },
    firingPosition() {
      return this.activeEvent.state.firingPosition;
    },
    firingPositionText() {
      return this.firingPosition ? this.firingPosition.str : 'Not set';
    },
    targetPosition() {
      return this.activeEvent.state.targetPosition;
    },
    targetPositionText() {
      return this.targetPosition ? this.targetPosition.str : 'Not set';
    },
    targetOffset() {
      return this.activeEvent.state.targetOffset;
    },
    mapScale() {
      if (!this.$store.state.core.prMap) return 1;
      return this.$store.state.core.prMap.metaData.scale[0];
    },
    targetOffsetText() {
      const signX = Math.sign(this.targetOffset.x);
      const signY = Math.sign(this.targetOffset.y);
      const xOffset = Math.abs(this.targetOffset.x);
      const yOffset = Math.abs(this.targetOffset.y);

      const offsetParts = [];
      if (signY !== 0) {
        const temp = `${yOffset * this.mapScale} m${
          signY <= 0 ? 'North' : 'South'
        }`;
        offsetParts.push(temp);
      }
      if (signX !== 0) {
        const temp = `${xOffset * this.mapScale} m${
          signX <= 0 ? 'West' : 'East'
        }`;
        offsetParts.push(temp);
      }

      if (offsetParts.length === 0) {
        return 'No offset';
      }
      return offsetParts.join(' ');
    },
    firingSolution() {
      return this.$store.getters['core/firingSolution'];
    },
    elevation() {
      if (!this.firingSolution) return null;
      return this.firingSolution.elevation;
    },
    elevationText() {
      if (!this.elevation) return 'N/A';
      return `${this.elevation} mils`;
    },
    deflection() {
      if (!this.firingSolution) return null;
      return this.firingSolution.deflection;
    },
    deflectionText() {
      if (this.deflection === null) return 'N/A';
      return `${this.deflection}\xB0`;
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>
