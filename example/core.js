import { coreInit } from 'isolated-core'

coreInit({
  scripts: ['/main.js'],
  run: core => require('./').init(core),
})
