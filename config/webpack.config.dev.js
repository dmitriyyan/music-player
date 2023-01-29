const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const ErrorOverlayWebpackPlugin = require('error-overlay-webpack-plugin');

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].js',
		publicPath: '',
	},
	devServer: {
		contentBase: path.resolve(__dirname, '../dist'),
		open: true,
		overlay: true,
		index: 'index.html',
		port: 5050,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/env'],
						plugins: [
							'@babel/plugin-proposal-private-methods',
							'@babel/plugin-proposal-class-properties',
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['**/*', '!assets*', '!assets/*/**'],
		}),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: './src/index.html',
		}),
		new webpack.HotModuleReplacementPlugin(),
		new ErrorOverlayWebpackPlugin(),
	],
};
