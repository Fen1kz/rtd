import {socketConnect, socketDisconnect} from '../../shared/actions';

import {clientToServer, server$userLogin} from '../actions';

import jwt from 'jsonwebtoken';

const jwtVerifyFails = (token) => {
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return false;
  } catch (e) {
    console.error(e);
    return e;
  }
};

const reportError = (e) => {
  console.error(e);
};

export const server$socketConnect = (socket) => (dispatch, getState) => {
  const socketId = socket.id;
  return new Promise((resolve, reject) => {
    socket.on('login:request', (token) => {
      const tokenValidationError = jwtVerifyFails(token);
      if (tokenValidationError) {
        reportError(tokenValidationError);
        reject(tokenValidationError);
        return;
      }
      socket.on('action', (incomingAction, callback) => {
        const action = {
          type: incomingAction.type
          , data: incomingAction.data
          , meta: {socketId}
        };
        if (!clientToServer[action.type]) {
          reportError(new Error(`No clientToServer[${action.type}]`));
          // if (callback) callback(false);
          return;
        }
        const result = dispatch(clientToServer[action.type](action.data, action.meta));
        if (!!callback) {
          if (result instanceof Promise) {
            result.then(callback);
          } else {
            callback();
          }
        }
      });
      dispatch(socketConnect(socket));
      dispatch(server$userLogin(socket.id));
      socket.emit('login:success', true);
      resolve();
    });
    socket.on('disconnect', () => {
      dispatch(socketDisconnect(socketId));
    });
  });
};

export const socketsClientToServer = {
  socketLogin: (data) => (dispatch) => {
    console.log('SOCKET LOGIN!', data);
    return 'hey!'
  }
};