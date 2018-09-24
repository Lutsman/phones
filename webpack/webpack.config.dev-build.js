'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const extractLess = new ExtractTextPlugin({
    filename: "styles/styles.css",
});

module.exports = merge(common, {
    mode: 'development',
    devtool: 'cheap-eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        extractLess,
    ],
    module: {
        rules: [
            {
                test: /\.(js)$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(less|css)$/,
                use: extractLess.extract(['css-loader?minimize=true?sourceMap=true', 'less-loader'])
            },
        ],
    },
});
