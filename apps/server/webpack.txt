const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  // CUSTOMIZE HERE
  entry: {
    server: './src/main.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
  },

  // JUST KEEP THEM
  externals: [nodeExternals()],
  mode: 'development',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
