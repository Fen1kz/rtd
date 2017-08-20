import {getSocket} from '../reducers/rd-server-sockets'

export default () => store => next => action => {
  if (action.meta) {
    const socketId = action.meta.socketId;
    if (socketId) {
      const socket = getSocket(store.getState(), socketId);
      if (!!socket) {
        socket.emit('action', action);
      }
    }
  }
  next(action);
}