import { coreInit, currentScript } from 'isolated-core'

coreInit({
  scripts: [currentScript.src],
  run: () => {
    throw new Error('this core crashes!')
  },
})
