const keyboardLetters = {
  65: 'A',
  66: 'B',
  67: 'C',
  68: 'D',
  69: 'E',
  70: 'F',
  71: 'G',
  72: 'H',
  73: 'I',
  74: 'J',
  75: 'K',
  76: 'L',
  77: 'M',
  78: 'N',
  79: 'O',
  80: 'P',
  81: 'Q',
  82: 'R',
  83: 'S',
  84: 'T',
  85: 'U',
  86: 'V',
  87: 'W',
  88: 'X',
  89: 'Y',
  90: 'Z',
};

const keyboardDigits = {
  48: '0',
  49: '1',
  50: '2',
  51: '3',
  52: '4',
  53: '5',
  54: '6',
  55: '7',
  56: '8',
  57: '9',
};

const keyboardExtra = {
  189: '-',
  188: ',',
  191: '/',
};

const numPadDigits = {
  96: '0',
  97: '1',
  98: '2',
  99: '3',
  100: '4',
  101: '5',
  102: '6',
  103: '7',
  104: '8',
  105: '9',
};

const numPadExtra = {
  106: '*',
  107: '+',
  109: '-',
  110: ',',
  111: '/',
  13: '_', // NumEnter mapped to underscore
};

const arrows = {
  37: '<',
  39: '>',
};

const mapping = {
  ...keyboardLetters,
  ...keyboardDigits,
  ...keyboardExtra,
  ...numPadDigits,
  ...numPadExtra,
  ...arrows,
};

export function rawCharToChar(raw) {
  const char = mapping[raw];
  return char || '';
}

export const activatorKeyCodes = [3612]; // Numpad enter
export const deactivatorKeyCodes = [
  28, // Enter
  3612, // Numpad enter
];
export const cancelKeyCodes = [1]; // Escape
export const clearKeyCodes = [14]; // Backspace

const nameMapping = {
  3612: 'Numpad Enter',
  28: 'Enter',
  1: 'Escape',
  14: 'Backspace',
};

export function rawCharToName(raw) {
  const name = nameMapping[raw];
  return name || 'UNKNOWN KEY';
}

export function isActivatorEvent(event) {
  return activatorKeyCodes.includes(event.keycode);
}
export function isDeactivatorEvent(event) {
  return deactivatorKeyCodes.includes(event.keycode);
}
export function isCancelEvent(event) {
  return cancelKeyCodes.includes(event.keycode);
}
export function isClearEvent(event) {
  return clearKeyCodes.includes(event.keycode);
}
// export const activatorKeyCode = 3675; // LeftWin

// export default { rawCharToChar, activatorRawChar };
