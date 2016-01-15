import getNextCoreId from './getNextCoreId'
import scriptsToHTML from './utils/scriptsToHTML'
import { destroyCore, swapCore } from './operations'

function coreInfo(context) {
  return {
    id: context._core.id,
    args: context._core.args,
    destroyCore: () => destroyCore(context),
    context,
  }
}

export default function loadCore(opts, uidocument = window._core.uidocument) {
  return new Promise((resolve, reject) => {
    const coreId = getNextCoreId(uidocument)
    const envEl = uidocument.createElement('iframe')
    envEl.setAttribute('data-coreid', coreId)
    uidocument.body.appendChild(envEl)

    const envContext = envEl.contentWindow
    const coreData = envContext._core = {
      id: coreId,
      uidocument: uidocument,
      args: opts.args,

      onReady(handlers) {
        coreData.attach = handlers.attach
        coreData.detach = handlers.detach
        resolve({
          launchCore: () => swapCore(window, envContext, uidocument),
          ...coreInfo(envContext),
        })
      },

      onExecutionError(err) {
        reject({
          type: 'js',
          err,
          ...coreInfo(envContext),
        })
      },

      onLoadError(src) {
        reject({
          type: 'request',
          src,
          ...coreInfo(envContext),
        })
      },
    }

    const envDoc = envEl.contentDocument
    envDoc.open()
    envDoc.write('<!doctype html><html><head></head><body>')
    envDoc.write(scriptsToHTML(opts.scripts, '_core.onLoadError(this.src)'))
    envDoc.write('</body></html>')
    envDoc.close()
  })
}
