const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('css-minimizer-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const WebpackBar = require('webpackbar');

module.exports = (env, argv) => {
	const isProduction = argv.mode === 'production';

	return {
		mode: argv.mode,
		context: path.resolve(__dirname, 'src'),
		entry: {
			index: ['./index.js', './sass/main.scss'],
		},
		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
				},
				{
					test: /\.(gif|png|jpe?g|svg)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.html$/,
					use: 'html-loader',
				},
				{
					test: /\.scss$/i,
					use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
				},
				{
					test: /\.hbs$/,
					use: 'handlebars-loader',
				},
			],
		},
		plugins: [
			isProduction && new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: './index.html',
				minify: isProduction,
			}),
			new MiniCssExtractPlugin({
				filename: 'main.min.css',
			}),
			new OptimizeCssAssetsPlugin(),
			new FriendlyErrorsWebpackPlugin(),
			new WebpackBar(),
		].filter(Boolean),
		devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
		devServer: {
			static: {
				directory: path.join(__dirname, 'src'),
			},
			historyApiFallback: true,
			compress: true,
			port: 4040,
			client: {
				logging: 'error',
			},
			open: true,
		},
	};
};
