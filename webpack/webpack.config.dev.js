'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const Path = require('path');

const dest = Path.join(__dirname, '../dist');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    contentBase: dest,
    inline: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    rules: [
      // {
      //   test: /\.(js)$/,
      //   include: Path.resolve(__dirname, '../src'),
      //   enforce: "pre",
      //   loader: 'eslint-loader',
      //   options: {
      //     emitWarning: true,
      //   }
      // },
      {
        test: /\.(js)$/,
        loader: 'babel-loader'
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader?sourceMap=true', 'resolve-url-loader', 'less-loader']
      },
    ]
  }
});
