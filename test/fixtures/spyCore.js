import 'core-js'
import { coreInit, loadCore, currentScript } from '../../src'

coreInit({
  scripts: [currentScript.src],
  run: core => {
    window.top.coreEvent('init', core)

    window.loadNextCore = function loadNextCore() {
      return loadCore({
        scripts: [currentScript.src],
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
