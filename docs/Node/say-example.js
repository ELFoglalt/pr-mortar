const say = require('say');

// Use default system voice and speed
say.speak('Hello!');

// Stop the text currently being spoken
say.stop();

// More complex example (with an OS X voice) and slow speed
say.speak('Elevation: 17 50, Deviation: 1 7 0', null, 1.3);
