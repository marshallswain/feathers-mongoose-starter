var webpack = require('webpack');
// var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
	cache: true,
  entry: {
    main: './apps/main/main.js'
  },
  output: {
    path: __dirname + '/public/assets',
    filename: '[name].js',
    publicPath: '/assets/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'es6-loader' },
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.woff$/,   loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf$/,    loader: 'file-loader' },
      { test: /\.eot$/,    loader: 'file-loader' },
      { test: /\.svg$/,    loader: 'file-loader' },
      { test: /\.png/, loader: 'url-loader?limit=100000&mimetype=image/png' },
      { test: /\.jpg/, loader: 'file-loader' }
    ]
  },
  plugins: [
    // Pack the core.
    // new webpack.optimize.CommonsChunkPlugin('core.js', null, 2),

    // new CompressionPlugin({
    //   asset: '{file}.gz',
    //   algorithm: 'gzip',
    //   regExp: /\.js$|\.html$/,
    //   threshold: 10240,
    //   minRatio: 0.8
    // })
  ],
  devtool:'inline-source-map',
  watch: true
};