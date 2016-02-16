import 'core-js'
import { coreInit, loadCore } from '../../src'
import { cacheBust } from '../utils'

const scriptURL = cacheBust('/base/test/fixtures/spyCore.js')

coreInit({
  scriptURL,
  run: core => {
    window.top.coreEvent('init', core)

    let nextCoreRef
    window.loadNextCore = function loadNextCore() {
      return loadCore({ scriptURL }).then(coreRef => nextCoreRef = coreRef)
    }

    window.launchNextCore = function launchNextCore(data) {
      nextCoreRef.launchCore(data)
      // When we call launchCore, the current iframe is removed from the DOM.
      // Subsequent statements should not be executed.
      window.top.coreEvent('xxx', core)
    }

    const handlers = {
      setup(data) {
        window.top.coreEvent('setup', core, data)
      },

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
