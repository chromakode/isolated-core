var baseConfig = require('./karma.conf')

module.exports = function(config) {
  baseConfig(config)

  var customLaunchers = {
    sl_chrome_46: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '46.0',
    },
    sl_chrome_47: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 7',
      version: '47.0',
    },
    sl_firefox_41: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 7',
      version: '41.0',
    },
    sl_firefox_42: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 7',
      version: '42.0',
    },
    sl_firefox_43: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 7',
      version: '43.0',
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '9.0',
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 7',
      version: '10.0',
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 10',
      version: '11.0',
    },
    sl_edge: {
      base: 'SauceLabs',
      browserName: 'MicrosoftEdge',
      platform: 'Windows 10',
      version: '20.10240',
    },
    sl_safari_6: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.8',
      version: '6.0',
    },
    sl_safari_7: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7.0',
    },
    sl_safari_8: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.10',
      version: '8.0',
    },
    sl_safari_9: {
      base: 'SauceLabs',
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9.0',
    },
    sl_ios_safari_8: {
      base: 'SauceLabs',
      browserName: 'iphone',
      deviceName: 'iPhone 4s',
      platform: 'OS X 10.10',
      version: '8.0',
    },
    sl_ios_safari_9: {
      base: 'SauceLabs',
      browserName: 'iphone',
      deviceName: 'iPhone 6',
      platform: 'OS X 10.10',
      version: '9.2',
    },
    sl_android_4: {
      base: 'SauceLabs',
      browserName: 'android',
      deviceName: 'Android Emulator',
      platform: 'Linux',
      version: '4.0',
    },
    sl_android_5: {
      base: 'SauceLabs',
      browserName: 'android',
      deviceName: 'Android Emulator',
      platform: 'Linux',
      version: '5.1',
    },
  }

  config.set({
    sauceLabs: {
      testName: 'Isolated Core Automated Tests',
    },
    captureTimeout: 3 * 60000,
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['mocha', 'coverage', 'saucelabs'],
    coverageReporter: {
      reporters: [
        { type: 'lcovonly' },
      ],
    },
  })
}
