'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const Path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLess = new ExtractTextPlugin({
    filename: "styles/styles.css",
});

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    stats: 'errors-only',
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin({filename: 'bundle.css'}),
        // compiling mode “scope hoisting”
        new webpack.optimize.ModuleConcatenationPlugin(),
        extractLess,
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: 'babel-loader'
            },
            {
                test: /\.(less|css)$/,
                use: extractLess.extract(['css-loader?minimize=true', 'less-loader'])
            }
        ]
    }
});
