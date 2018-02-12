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
        test: [/\.jsx?$/, /\.js?$/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react']
        }
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader'],
        }),
      },
    ]
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js", ".jsx", "*"]
  }
};
