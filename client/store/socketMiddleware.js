import {getSocket} from '../reducers/rd-client-socket'

export default () => store => next => action => {
  // console.log('socketMiddleware', action);
  if (action.meta) {
    const socket = action.meta.socket || getSocket(store.getState());
    if (!!socket && action.meta.server) {
      action.meta = null;
      socket.emit('action', action);
    }
  }
  return next(action);
}