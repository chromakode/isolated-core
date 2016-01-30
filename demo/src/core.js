import { coreInit } from 'isolated-core'

coreInit({
  scriptURL: 'main.js',
  run: core => require('./').init(core),
})
