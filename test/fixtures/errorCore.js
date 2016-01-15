import { coreInit, currentScript } from '../../src'

coreInit({
  scripts: [currentScript.src],
  run: () => {
    throw new Error('oh noes!')
  },
})
