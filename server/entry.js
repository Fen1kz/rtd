import AppServer from './AppServer';

const appServer = new AppServer().start();

if (module.hot) {
  module.hot.addDisposeHandler((data) => {
    appServer.stop();
  });
  module.hot.accept((err) => {
    console.log('HMR Error', err);
  });
}