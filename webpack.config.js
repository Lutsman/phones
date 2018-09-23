const webpack =  require('webpack');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const ExtractTextWebpackPlugin =  require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const extractLess = new ExtractTextPlugin({
    filename: "styles/styles.css",
});

// new webpack.ProvidePlugin({
//     $: 'jquery',
//     jQuery: 'jquery'
// });

module.exports = {
    entry: './src/index',
    output: {
        filename: 'scripts/app.js',
        path: `${__dirname}/dist`,
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: '../src',
                loader: 'babel-loader',
            },
            {
                test: /\.(less|css)$/,
                // use: ['style-loader', 'css-loader?sourceMap=true', 'resolve-url-loader', 'less-loader'],
                // use: extractLess.extract(['css-loader?sourceMap=true', 'resolve-url-loader', 'less-loader'])
                loader: new ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader?sourceMap=true', 'resolve-url-loader', 'less-loader'],
                    filename: "styles/styles.css",
                }),
            },
            {
                test: /\.(ico|jpg|jpeg|png|gif|webp)(\?.*$|$)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        publicPath: '../images/',
                    },
                },
            },
            {
                test: /\.(eot|otf|svg|ttf|woff|woff2)(\?.*$|$)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'fonts/',
                        publicPath: '../fonts/',
                    },
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor-[hash].js',
        }),
    ],
};
