const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.renderer.config.js');

const app = express();
const compiler = webpack({ ...config, mode: 'development' });

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/',
}));

app.use(webpackHotMiddleware(compiler));

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Type Master dev server running at http://localhost:${PORT}`);
});