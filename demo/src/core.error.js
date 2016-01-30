import { coreInit } from 'isolated-core'

coreInit({
  scriptURL: 'error.js',
  run: () => {
    throw new Error('this core crashes!')
  },
})
