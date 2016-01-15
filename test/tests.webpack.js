// Inspired by:
// https://github.com/deepsweet/isparta-loader
// https://github.com/webpack/karma-webpack#alternative-usage
// http://kentor.me/posts/testing-react-and-flux-applications-with-karma-and-webpack/

import 'core-js'

// Require all tests.
const testsContext = require.context('.', true, /-test.js$/)
testsContext.keys().forEach(testsContext)

// Require all source files so we get full coverage stats.
const srcContext = require.context('../src/', true)
srcContext.keys().forEach(srcContext)
