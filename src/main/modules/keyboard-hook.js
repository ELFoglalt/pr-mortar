import iohook from 'iohook';
import { store, storeTypes } from '../../store';

export function broadcastKeyboardEvent(event) {
  // console.log(event);
  store.dispatch(storeTypes.actionTypes.A_PUSH_KEYBOARD_EVENT, { event });
}

export function startKeyboardEvent() {
  iohook.addListener('keydown', broadcastKeyboardEvent);
  iohook.addListener('keyup', broadcastKeyboardEvent);
  iohook.start();
}

export function stopKeyboardEvent() {
  iohook.stop();
  iohook.removeAllListeners();
}

export default {
  broadcastKeyboardEvent,
  startKeyboardEvent,
  stopKeyboardEvent,
};
