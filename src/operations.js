import noop from './utils/noop'

export function destroyCore(context) {
  const coreData = context._core
  coreData.onReady = coreData.onExecutionError = coreData.onLoadError = noop
  context.frameElement.parentNode.removeChild(context.frameElement)
}

export function detachCore(context, uidocument) {
  context.frameElement.removeAttribute('data-core-active')
  context._core.detach(uidocument)
}

export function attachCore(nextContext, uidocument) {
  nextContext.frameElement.setAttribute('data-core-active', '')
  nextContext._core.attach(uidocument)
}

export function swapCore(context, nextContext, uidocument) {
  detachCore(context, uidocument)
  attachCore(nextContext, uidocument)
  destroyCore(context)
}
