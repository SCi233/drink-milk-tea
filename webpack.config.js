const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.[hash].js',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.js$/,
        use: {
          loader: 'source-map-loader',
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, './public/index.html'),
      inject: 'body',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/assets',
          to: 'assets',
        },
      ],
      options: {
        concurrency: 100,
      },
    }),
  ]
};
