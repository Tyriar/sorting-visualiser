var path = require('path');

module.exports = {
  entry: "./demo/demo.js",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: "bundle.js"
  },
  devServer: {
    hot: true
  }
};
