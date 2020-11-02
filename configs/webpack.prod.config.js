const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const base = require('./webpack.base.config');
const {merge} = require('webpack-merge');

const prod = {
  mode: 'production',
  plugins: [new CleanWebpackPlugin()]
};

module.exports = merge(base, prod);
