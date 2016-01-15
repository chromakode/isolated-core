import loadCore from './loadCore'
import { attachCore } from './operations'

export default function coreInit(opts) {
  if (!window._core) {
    // We're running in a top level script.
    // Load the first core and attach it.
    return loadCore(opts, document).then(coreRef => {
      attachCore(coreRef.context, document)
      return coreRef
    })
  }

  const core = {
    id: window._core.id,
    args: window._core.args,
    ready: handlers => window._core.onReady(handlers),
  }

  try {
    opts.run(core)
  } catch (err) {
    window._core.onExecutionError(err)
    throw err
  }
}
