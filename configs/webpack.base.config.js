const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, '../src/js/index.js'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'app.js'
  },
  resolve: {
    extensions: ['.js', 'css', '.scss'],
    alias: {
      '@js': path.join(__dirname, '../src/js'),
      '@styles': path.join(__dirname, '../src/styles')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true // 불러오는 정적 빌드 파일에 쿼리스트링으로 해시값 추가
    }),
    new MiniCssExtractPlugin({filename: 'app.css'})
  ]
};
