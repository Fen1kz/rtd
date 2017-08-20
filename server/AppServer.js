import http from 'http';
// import io from 'socket.io';
import createFrontendMiddleware from './frontend/create-frontend-middleware';

const IO_OPTIONS = {
  path: '/api/socket-io'
  , serveClient: false
  , transports: ['websocket']
};

export default class AppServer {
  constructor() {
    this.loadApplication = this.loadApplication.bind(this, () => new (require('./Application').default)());
    this.nextSocketId = 0;
    this.sockets = {};

    this.httpServer = http.createServer();
    this.httpServer.removeAllListeners('request');
    this.frontendMiddleware = createFrontendMiddleware();

    this.loadApplication();

    if (module.hot) {
      module.hot.accept('./Application', this.loadApplication, (err) => console.log('HMR Error', err));
    }
  }

  loadApplication(requireNew) {
    if (this.currentApplication) {
      this.httpServer.removeAllListeners('request');
      this.httpServer.removeAllListeners('upgrade');
      // if (this.ioServer) {
      //   this.ioServer.removeAllListeners('connection');
      // }
    }
    this.currentApplication = requireNew();
    this.frontendMiddleware(this.currentApplication.httpHandler);
    this.httpServer.on('request', this.currentApplication.httpHandler);
    // this.ioServer = io(this.httpServer, IO_OPTIONS);
    // this.ioServer.on('connection', this.currentApplication.socketHandler);
    console.log('APP LOADED')
  }

  start() {
    this.httpServer
      .listen(process.env.PORT, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.info(`Listening on port ${process.env.PORT}.`);
        }
      })
      .on('connection', (socket) => {
        let socketId = this.nextSocketId++;
        this.sockets[socketId] = socket;
        socket.once('close', () => {
          delete this.sockets[socketId];
        })
      });
    return this;
  }

  stop() {
    Object.keys(this.sockets).forEach(socketId => {
      this.sockets[socketId].destroy();
    });
    // this.ioServer.close();
    this.httpServer.close();
    return this;
  }
}

// const port = 4000;
// let nextSocketId = 0;
// const sockets = {};
//
// console.log('MAIN entry.js');
// const httpListener = (new AppServer()).app
//   .listen(port, (error) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.info(`🌎 Listening on port ${port}.`);
//     }
//   });
//   .on('connection', (socket) => {
//     let socketId = nextSocketId++;
//     sockets[socketId] = socket;
//     socket.once('close', () => {
//       delete sockets[socketId];
//     })
//   });
//
// if (module.hot) {
//   module.hot.addDisposeHandler((data) => {
//     Object.keys(sockets).forEach(socketId => {
//       sockets[socketId].destroy();
//     });
//     httpListener.close();
//     // appServer.acceptHMR();
//     // data.httpListener = httpListener;
//     // data.appServer = appServer;
//   });
//   module.hot.accept((err) => {
//     console.log('HMR Error', err);
//   });
// }