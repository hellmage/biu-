var path = require('path');
var glob = require("glob");

module.exports = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  entry: glob.sync("./src/**/*.js").filter(function(p) { return p != './src/main.js'; }),
  output: {
    path: path.resolve(__dirname, 'built'),
    filename: 'bundle.js'
  }
}
