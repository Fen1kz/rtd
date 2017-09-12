import React from 'react';
import ReactDOM from 'react-dom';

import {AppContainer} from 'react-hot-loader';
import {Provider} from 'react-redux'

// import { combineReducers } from 'redux-immutable';
// import configureStore from './configuration/configureStore'

// Socket
// import {makeSocketClient, socketStore, socketMiddleware} from './configuration/socket';

// Routing
// import {routerReducer, appRouterMiddleware, syncHistoryWithStore} from './configuration/routing';

// Components
// import { Root } from './components/Root.jsx';
// import { DevTools } from './components/DevTools.jsx'
// import * as reducers from './reducers'

// Styles
// import './styles/reset.scss';
// import 'react-mdl/extra/css/material.teal-indigo.min.css'
// import 'react-mdl/extra/material.min.js'
// import './styles/style.scss';

// Store
import createHistory from 'history/createBrowserHistory';
// import createStore from './store/createStore';
const history = createHistory({basename: GLOBAL_BASENAME});
// const store = createStore(history);

const render = () => {
  const App = require('./views/App').default;
  ReactDOM.render(
    <AppContainer>
      {/*<Provider store={store}>*/}
      <App history={history}/>
      {/*</Provider>*/}
    </AppContainer>
    , document.getElementById('app')
  );
};

render();

if (module.hot) {
  module.hot.accept('./views/App', render);
}