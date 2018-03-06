const path = require('path');

module.exports = {
  context: __dirname,
  entry: './frontend/fitormiss.jsx',
  output: {
    path: path.resolve(__dirname, 'app', 'assets', 'javascripts'),
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'env'],
          plugins: [
            ["transform-class-properties", {"spec": true}],
            ["transform-object-rest-spread"]
          ]
        }
      }
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
