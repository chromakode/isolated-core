import { coreInit } from 'isolated-core'

coreInit({
  scripts: ['/main.js'],
  run: () => {
    throw new Error('this core crashes!')
  },
})
