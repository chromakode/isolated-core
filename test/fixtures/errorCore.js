import { coreInit } from '../../src'

coreInit({
  scriptURL: '/base/test/fixtures/errorCore.js',
  run: () => {
    throw new Error('oh noes!')
  },
})
