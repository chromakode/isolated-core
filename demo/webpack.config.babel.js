import webpack from 'webpack'
import path from 'path'

export default {
  entry: {
    main: './src/core.js',
    green: './src/core.green.js',
    error: './src/core.error.js',
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.less$/,
        loaders: ['css', 'autoprefixer', 'less'],
      },
      {
        test: /\.woff$|\.png$/,
        loader: 'url',
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
}
