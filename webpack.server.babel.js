'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const WebpackShellPlugin = require('webpack-shell-plugin');
const globals = require('./globals');

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  target: 'node'
  , entry: [
    isDevelopment && 'webpack/hot/poll?1000'
    , './server/entry.js'
  ].filter(x => !!x)
  , watch: isDevelopment
  , externals: [nodeExternals({
    whitelist: [/^webpack\/hot/]
  })]
  , devtool: isDevelopment ? 'eval' : 'source-map'
  , output: {
    filename: 'server.bundle.js',
    path: path.resolve(__dirname, 'dist/server')
  }
  , resolve: {
    extensions: ['.js', '.jsx']
  }
  , module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {presets: ['stage-2']}
      }
    ]
  }
  , plugins: [
    new webpack.NamedModulesPlugin()
    , isDevelopment && new WebpackShellPlugin({onBuildEnd: ['node dist/server/server.bundle.js']})
    , isDevelopment && new webpack.HotModuleReplacementPlugin()
  ].filter(x => !!x)
};

module.exports = config;