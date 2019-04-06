<template>
  <div>
    <b-field grouped>
      <b-switch :title='enableSwitchTooltip' @focus.native='clearFocus' v-model='isEnabled'/>
      <b-field :type='inputFlavour' expanded>
        <b-input v-model='displayMessage' disabled></b-input>
      </b-field>
    </b-field>
    <div id='message' :class='messageFlavour + " has-text-right"'>{{messageText}}</div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import iohook from 'iohook';
import {
  isActivatorEvent,
  isDeactivatorEvent,
  isCancelEvent,
  isClearEvent,
  rawCharToChar,
} from '../modules/input.js';
import { parseCommand, applyCommand } from '../modules/command.js';
import { clearFocusMixin } from '../mixins/clearFocusMixin';

export default {
  data() {
    return {
      isActive: false,
      isEnabled: true,
      commandBuffer: '',
      messageType: '',
      messageText: '',
    };
  },
  mixins: [clearFocusMixin],
  computed: {
    isRecording() {
      return this.isEnabled && this.isActive;
    },
    displayMessage() {
      if (!this.isEnabled) {
        return 'Hotkeys disabled';
      }
      if (this.isRecording) {
        return this.commandBuffer;
      }
      return "Press 'numpad enter' to type commands";
    },
    messageFlavour() {
      if (!this.isEnabled) return '';
      if (this.messageType === 'error') return 'has-text-danger';
      if (this.messageType === 'warning') return 'has-text-warning';
      if (this.messageType === 'info') return 'has-text-success';
      return '';
    },
    inputFlavour() {
      if (!this.isEnabled) return '';
      if (this.messageType === 'error') return 'is-danger';
      if (this.messageType === 'warning') return 'is-warning';
      if (this.messageType === 'info') return 'is-success';
      return '';
    },
    enableSwitchTooltip() {
      return `${this.isEnabled ? 'Disable' : 'Enable'} command input`;
    },
    ...mapState('core', ['prMap']),
    ...mapGetters('core', ['activeEvent']),
  },
  watch: {
    isEnabled: {
      immediate: true,
      handler(newEnabled) {
        this.clearFocus();
        if (newEnabled) {
          this.startListeingForKeyboardEvents();
        } else {
          this.stopListeningForKeyboardEvents();
        }
        this.deactivate();
        this.clearBuffer();
      },
    },
  },
  beforeDestroy() {
    if (this.isEnabled) {
      this.stopListeningForKeyboardEvents();
    }
  },
  methods: {
    startListeingForKeyboardEvents() {
      iohook.addListener('keyup', this.handleKeyboardEvent);
      iohook.start();
    },
    stopListeningForKeyboardEvents() {
      iohook.stop();
      iohook.removeAllListeners();
    },
    handleKeyboardEvent(event) {
      if (isActivatorEvent(event) && !this.isActive) {
        this.activate();
        return;
      }
      if (this.isActive) {
        if (isCancelEvent(event)) {
          this.deactivate();
          this.clearBuffer();
          return;
        }
        if (isDeactivatorEvent(event)) {
          this.deactivate();
          this.parseBuffer();
          return;
        }
        if (isClearEvent(event)) {
          this.commandBuffer = this.commandBuffer.slice(0, -1);
          return;
        }
      }
      if (this.isRecording) {
        this.commandBuffer += rawCharToChar(event.rawcode);
      }
    },
    activate() {
      if (!this.isEnabled) {
        return;
      }
      this.isActive = true;
      iohook.disableKeyboardPropagation();
    },
    deactivate() {
      if (!this.isEnabled) {
        return;
      }
      this.isActive = false;
      iohook.enableKeyboardPropagation();
    },
    clearBuffer() {
      this.commandBuffer = '';
      this.messageType = '';
      this.messageText = '';
    },
    parseBuffer() {
      if (!this.prMap) {
        this.commandBuffer = '';
        this.messageType = 'warning';
        this.messageText = 'No map loaded.';
        return;
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

      this.aAddEvent({ command, state: newState });
    },
    ...mapActions('core', ['aAddEvent']),
  },
};
</script>

<style lang="scss" scoped>
#message {
  width: 100%;
  margin-top: -10px;
  min-height: 24px;
  margin-bottom: 10px;
}
</style>
