global.window = {};
window.localStorage = require('./local-storage-mock').default();
window.sessionStorage = require('./local-storage-mock').default();
global.WebSocket = require('ws'); // Hack for https://github.com/socketio/engine.io-client/blob/master/lib/transports/websocket.js#L13
window.performance = {
  now: () => process.hrtime()
};