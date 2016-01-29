import path from 'path'

export default {
  entry: {
    main: './core.js',
    green: './core.green.js',
    slow: './core.slow.js',
    error: './core.error.js',
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
        loaders: ['css', 'less'],
      },
    ],
  },
}
