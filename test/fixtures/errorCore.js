import { coreInit } from '../../src'

coreInit({
  scripts: ['/base/test/fixtures/errorCore.js'],
  run: () => {
    throw new Error('oh noes!')
  },
})
