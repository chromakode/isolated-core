import { coreInit } from 'isolated-core'

coreInit({
  scriptURL: 'main.js',
  run: () => {
    throw new Error('this core crashes!')
  },
})
