import {Record} from 'immutable';
import {createStore, combineReducers, compose, applyMiddleware} from 'redux'

// Basic Middleware
import thunk from 'redux-thunk';

import apiMiddleware from './apiMiddleware';
// import socketMiddleware from './socketMiddleware';
import questionMiddleware from './questionMiddleware';

// History
import historyMiddleware from './historyMiddleware';

class ClientRecord extends Record({
  app: void 0
  // , error: void 0
  , socket: void 0
  , user: void 0
  , game: void 0
}) {
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (history) => {
  const store = createStore(
    require('../reducers').default
    , new ClientRecord()
    , composeEnhancers(applyMiddleware(
      thunk
      , apiMiddleware()
      , questionMiddleware()
      // , socketMiddleware()
      , historyMiddleware(history)
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