var path = require('path')

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],
    files: [
      'test/tests.webpack.js',
      {
        pattern: 'test/fixtures/*.js',
        included: false,
        served: true,
        watched: true,
      },
    ],
    preprocessors: {
      'test/tests.webpack.js': ['webpack', 'sourcemap'],
      'test/fixtures/*.js': ['webpack'],
    },
    webpack: {
      devtool: 'inline-source-map',
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            include: path.resolve('src'),
            loader: 'isparta',
          },
        ],
        loaders: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel',
          },
        ],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
    browsers: ['PhantomJS'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      reporters: [
        { type: 'text' },
      ],
    },
    port: 9876,
    singleRun: true,
  })
}
