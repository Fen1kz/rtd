'use strict';
import express from 'express';
import EventEmitter from 'events';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {ApiRouter} from './api/ApiRouter';

import createStore from './store/createStore';
import {server$socketConnect} from './actions';

import Game from '../shared/game/Game';

export default class Application {
  constructor() {
    this.app = this.createExpressApp();
    this.store = createStore();

    this.httpHandler = this.app;
    this.socketHandler = (socket) => this.store.dispatch(server$socketConnect(socket));
  }

  createExpressApp() {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.text());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/api', (new ApiRouter()).router);

    return app;
  }
}