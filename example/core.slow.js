import { coreInit } from 'isolated-core'

coreInit({
  scriptURL: 'main.js',
  run: core => {
    const start = Date.now()
    while (Date.now() < start + 2000) {}  // eslint-disable-line no-empty
    require('./').init(core)
  },
})
