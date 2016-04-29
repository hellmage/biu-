var path = require('path')

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'built'),
    filename: 'bundle.js'
  },
  devtool: '#inline-source-map'
}
