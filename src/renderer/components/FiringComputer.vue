<template>
  <div id='wrapper'>
    <div class='tile is-ancestor'>
      <div class='tile is-vertical'>
        <div class='tile'>
          <div class='tile is-parent'>
            <article class='tile is-one-third is-child notification'>
              <p class='has-text-weight-bold has-text-grey'>Firing Position:</p>
              <span class='has-text-primary'>{{ firingPositionText }}</span>
            </article>
          </div>
          <div class='tile is-parent'>
            <article class='tile is-one-third is-child notification'>
              <p class='has-text-weight-bold has-text-grey'>Target Position:</p>
              <span class='has-text-primary'>{{ targetPositionText }}</span>
            </article>
          </div>
          <div class='tile is-parent'>
            <article class='tile is-one-third is-child notification'>
              <p class='has-text-weight-bold has-text-grey'>Target offset:</p>
              <span class='has-text-primary'>{{ targetOffsetText }}</span>
            </article>
          </div>
        </div>
        <div class='tile'>
          <div class='tile is-parent'>
            <article class='tile is-half is-child notification'>
              <div class='level'>
                <div class='level-left'>
                  <div>
                    <span class='has-text-weight-bold has-text-grey'>Elevation:</span>
                    <span class='has-text-primary'>{{ elevationText }}</span>
                  </div>
                </div>
                <div class='level-right'>
                  <b-checkbox-button :title='elevationMuteTooltip' v-model='muteElevationAudio'>
                    <v-icon v-if='muteElevationAudio' name='volume-x'></v-icon>
                    <v-icon v-else name='volume-2'></v-icon>
                  </b-checkbox-button>
                </div>
              </div>
            </article>
          </div>
          <div class='tile is-parent'>
            <article class='tile is-half is-child notification'>
              <div class='level'>
                <div class='level-left'>
                  <div>
                    <span class='has-text-weight-bold has-text-grey'>Deflection:</span>
                    <span class='has-text-primary'>{{ deflectionText }}</span>
                  </div>
                </div>
                <div class='level-right'>
                  <b-checkbox-button
                    :title='deflectionMuteTooltip'
                    @focus.native='clearFocus'
                    v-model='muteDeflectionAudio'
                  >
                    <v-icon v-if='muteDeflectionAudio' name='volume-x'></v-icon>
                    <v-icon v-else name='volume-2'></v-icon>
                  </b-checkbox-button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import say from 'say';
import { clearFocusMixin } from '../mixins/clearFocusMixin';

export default {
  data() {
    return {
      muteElevationAudio: true,
      muteDeflectionAudio: true,
    };
  },
  mixins: [clearFocusMixin],
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
        const temp = `${yOffset * this.mapScale} m ${
          signY <= 0 ? 'North' : 'South'
        }`;
        offsetParts.push(temp);
      }
      if (signX !== 0) {
        const temp = `${xOffset * this.mapScale} m ${
          signX <= 0 ? 'West' : 'East'
        }`;
        offsetParts.push(temp);
      }

      if (offsetParts.length === 0) {
        return 'No offset';
      }
      return offsetParts.join(', ');
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
    elevationMuteTooltip() {
      return `${
        this.muteElevationAudio ? 'Mute' : 'Unmute'
      } elevation readouts`;
    },
    deflection() {
      if (!this.firingSolution) return null;
      return this.firingSolution.deflection;
    },
    deflectionText() {
      if (this.deflection === null) return 'N/A';
      return `${this.deflection}\xB0`;
    },
    deflectionMuteTooltip() {
      return `${
        this.muteDeflectionAudio ? 'Mute' : 'Unmute'
      } deflection readouts`;
    },
  },
  watch: {
    firingSolution(newFiringSolution) {
      this.sayFiringSolution(newFiringSolution);
    },
    muteElevationAudio() {
      this.clearFocus();
    },
    muteDeflectionAudio() {
      this.clearFocus();
    },
  },
  methods: {
    splitNumber(number) {
      number = number.toString();
      if (number.length <= 2) return number;
      if (number.length === 3) return number.split('').join(' ');

      let result = '';
      for (let i = 0; i < number.length; i += 1) {
        result += i % 2 ? `${number[i]}` : ` ${number[i]}`;
      }
      return result;
    },
    sayFiringSolution({ elevation, deflection }) {
      const sayMessageParts = [];
      if (!this.muteElevationAudio) {
        sayMessageParts.push(`elevation: ${this.splitNumber(elevation)}`);
      }
      if (!this.muteDeflectionAudio) {
        sayMessageParts.push(`deflection: ${this.splitNumber(deflection)}`);
      }

      if (sayMessageParts.length === 0) {
        return;
      }

      const sayMessage = sayMessageParts.join(', ');

      say.speak(sayMessage, null, 1.3);
    },
  },
};
</script>

<style lang="scss" scoped>
#wrapper {
  padding-top: 24px;
  padding-bottom: 24px;
}
</style>
