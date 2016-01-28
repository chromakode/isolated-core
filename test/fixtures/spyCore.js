import 'core-js'
import { coreInit, loadCore } from '../../src'

const scriptURL = '/base/test/fixtures/spyCore.js'

coreInit({
  scriptURL,
  run: core => {
    window.top.coreEvent('init', core)

    window.loadNextCore = function loadNextCore() {
      return loadCore({ scriptURL })
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
