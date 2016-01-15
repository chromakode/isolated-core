import { coreInit, currentScript } from 'isolated-core'

coreInit({
  scripts: [currentScript.src],
  run: core => {
    const start = Date.now()
    while (Date.now() < start + 2000) {}  // eslint-disable-line no-empty
    require('./').init(core)
  },
})
