import 'core-js'
import { coreInit, loadCore } from '../../src'

const URL = '/base/test/fixtures/spyCore.js'

coreInit({
  scripts: [URL],
  run: core => {
    window.top.coreEvent('init', core)

    window.loadNextCore = function loadNextCore() {
      return loadCore({
        scripts: [URL],
      })
    }

    const handlers = {
      attach(uidocument) {
        window.top.coreEvent('attach', core, uidocument)
      },

      detach(uidocument) {
        window.top.coreEvent('detach', core, uidocument)
      },
    }

    window.top.coreEvent('ready', core, handlers)
    core.ready(handlers)
  },
})
