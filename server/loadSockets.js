export default (eventBus) => (socket) => {
  // appServer.currentApplication.startGame();
  eventBus.emit('connection', socket);
}