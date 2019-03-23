<template>
  <div>
    <b-field :type='inputFlavour' :message='messageText'>
      <b-input v-model='displayMessage' disabled></b-input>
    </b-field>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import { activatorKeyCode, rawCharToChar } from '../modules/input.js';
import { parseCommand, applyCommand } from '../modules/command.js';

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
      commandBuffer: '',
      messageType: '',
      messageText: '',
    };
  },
  computed: {
    isRecording() {
      return this.isEnabled && this.isActive;
    },
    displayMessage() {
      return this.isRecording
        ? this.commandBuffer
        : "Hold 'left alt' to type commands";
    },
    inputFlavour() {
      if (this.messageType === 'error') return 'is-danger';
      if (this.messageType === 'warning') return 'is-warning';
      if (this.messageType === 'info') return 'is-success';
      return '';
    },
    ...mapState('keyboardInput', ['keyboardEvent']),
    ...mapState('core', ['prMap']),
    ...mapGetters('core', ['activeEvent']),
  },
  watch: {
    keyboardEvent(event) {
      if (event.type === 'keydown' && event.keycode === activatorKeyCode) {
        this.activate();
      }
      if (event.type === 'keyup') {
        if (event.keycode === activatorKeyCode) {
          this.deactivate();
        }

        if (this.isRecording) {
          this.commandBuffer += rawCharToChar(event.rawcode);
        }
      }
    },
  },
  methods: {
    activate() {
      this.isActive = true;
    },
    deactivate() {
      this.isActive = false;

      if (!this.prMap) {
        this.commandBuffer = '';
      }

      if (this.commandBuffer === '') {
        this.messageType = 'warning';
        this.messageText = 'No command.';
        return;
      }

      const command = parseCommand(this.commandBuffer);
      this.commandBuffer = '';

      if (command.unknownStr || !command.parameter) {
        this.messageType = 'error';
        this.messageText = `Failed to parse '${command.unknownStr}'.`;
        return;
      }

      const newState = applyCommand(
        this.activeEvent.state,
        command,
        this.prMap,
      );

      if (!newState) {
        this.messageType = 'warning';
        this.messageText = `Command: '${
          command.commandType.description
        }' had no effect.`;
        return;
      }

      this.messageType = 'info';
      this.messageText = `Command succesful: '${
        command.commandType.description
      } ${command.parameter.str}'`;

      this.aAddEvent({ command, newState });
    },
    ...mapActions('core', ['aAddEvent']),
  },
};
</script>

<style lang="scss" scoped>
</style>
