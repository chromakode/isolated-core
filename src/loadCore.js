import getNextCoreId from './getNextCoreId'
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

    const envDoc = envEl.contentDocument
    envDoc.open()

    const envContext = envEl.contentWindow
    const coreData = envContext._core = {
      id: coreId,
      uidocument: uidocument,
      args: opts.args,

      onReady(handlers) {
        coreData.attach = handlers.attach
        coreData.detach = handlers.detach
        coreData.setup = handlers.setup
        resolve({
          launchCore: data => swapCore(window, envContext, uidocument, data),
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

    const contentHTML = `<!doctype html><html><body><script src="${opts.scriptURL}" onerror="_core.onLoadError(this.src)"></script></body></html>`
    envDoc.write(contentHTML)
    envDoc.close()
  })
}
