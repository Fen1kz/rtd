'use strict';

import path from 'path';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'secret';

const config = require('./webpack.server.babel');

Object.assign(config, {
  entry: [
    'babel-polyfill'
    , './test/test-entry.js'
  ]
  , output: {
    filename: 'server.bundle.js'
    , path: path.resolve(__dirname, '.tmp')
  }
  , module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['stage-2']
          , plugins: ['transform-async-to-generator']
        }
      }
    ]
  }
});

module.exports = config;