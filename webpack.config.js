'use strict'

// todo: надо перенести в галп может быть?
const NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  mode: NODE_ENV,
  devtool: 'source-map',
  entry: './source/gui/scripts/main.js',
  output: {
    path: __dirname + '/source/gui/public/dist',
    filename: 'app.js'
  },
  stats: {
    colors: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  }
}
