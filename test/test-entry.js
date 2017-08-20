import './setup'

import ioServer from 'socket.io';
import ioClient from 'socket.io-client';
import jwt from 'jsonwebtoken';

import createServerStore from '../server/store/createStore';
import createClientStore from '../client/store/createStore';
import createHistory from 'history/createMemoryHistory';
import {server$socketConnect} from '../server/actions';
import {client$socketConnect, authLoginSuccess} from '../client/actions';


const SOCKET_URL = 'http://localhost:5000';

export const createServer = () => {
  const serverStore = createServerStore();
  const serverSocket = ioServer(5000, {
    serveClient: false
    , transports: ['websocket']
  });
  const serverPromise = new Promise((resolve) => {
    serverSocket.on('connection', (socket) => {
      serverStore.dispatch(server$socketConnect(socket))
        .then(resolve);
      socket.on('echo', (data, callback) => {
        console.log('server got echo');
        callback('echo returned')
      })
    });
  });
  return {serverStore, serverPromise}
};

export const createClient = () => {
  const store = createClientStore(createHistory());
  const clientSocket = ioClient(SOCKET_URL, {
    'force new connection': true
    , transports: ['websocket']
  });
  store.dispatch(authLoginSuccess({token: jwt.sign({}, process.env.JWT_SECRET)}));
  store.dispatch(client$socketConnect(clientSocket));
  return clientSocket;
};

describe('describe', function () {
  this.timeout(1000000);
  it('it', async () => {
    const {serverStore, serverPromise} = createServer();
    const clientSocket = createClient();
    await new Promise(resolve => clientSocket.on('connect', () => {
      resolve();
    }));
    console.log(serverStore.getState());
    await serverPromise;
    await new Promise(resolve => {
      clientSocket.emit('echo', 'echo', (...args) => {
        console.log('emit', ...args)
        resolve()
      })
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(serverStore.getState());
  })
});