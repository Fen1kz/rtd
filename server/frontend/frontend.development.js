import path from 'path';
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

export default (makeWebpackConfig) => {
  const webpackConfig = makeWebpackConfig();
  const compiler = webpack(webpackConfig);
  const devMiddleware = webpackDevMiddleware(compiler, {
    noInfo: false
    , publicPath: webpackConfig.output.publicPath
    , silent: false
    , stats: 'errors-only'
  });
  const hotMiddleware = webpackHotMiddleware(compiler);

  // Since webpackDevMiddleware uses memory-fs internally to store build
  // artifacts, we use it instead
  const fs = devMiddleware.fileSystem;

  return (app) => {
    app.use(devMiddleware);
    app.use(hotMiddleware);
    app.get('*', (req, res) => {
      const file = fs.readFileSync(path.join(compiler.outputPath, 'index.html'));
      res.send(file.toString());
    });
  }
};