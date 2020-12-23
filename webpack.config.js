const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path')
const webpack = require('webpack')
const development = process.env.NODE_ENV != 'production'
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
require("dotenv").config()


const client = {
    name: "client",
    mode: development ? "development" : "production",
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: development ? "[name].js" : "[name]-[hash].js",
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(css|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'resolve-url-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|png|woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader?limit=100000'
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new HtmlWebPackPlugin({
            template: "./client/index.html",
            filename: "./index.html"
        }),
        new webpack.DefinePlugin({
            'process.env': {
                REACT_APP_API: JSON.stringify(process.env.HOST + ':' + process.env.PORT)
            }
        })
    ]
}

const ide = {
    name: "ide",
    mode: development ? "development" : "production",


}
module.exports = client