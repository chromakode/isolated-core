import { coreInit, currentScript } from 'isolated-core'

coreInit({
  scripts: [currentScript.src],
  run: core => require('./').init(core),
})
