import {Record} from 'immutable';
import {createStore, compose, applyMiddleware} from 'redux'

// Basic Middleware
import thunk from 'redux-thunk';

import socketMiddleware from './socketMiddleware';
import questionMiddleware from './questionMiddleware';

const ServerRecord = Record({
  sockets: void 0
}, 'ServerRecord');

export default () => {
  const store = createStore(
    require('../reducers').default
    , new ServerRecord()
    , compose(applyMiddleware(
      thunk
      , socketMiddleware()
      , questionMiddleware()
    ))
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}