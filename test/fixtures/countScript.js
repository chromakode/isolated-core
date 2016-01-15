import { currentScript } from '../../src'

const scriptId = Number(currentScript.id)
window.top.coreEvent('script-run', { args: { order: scriptId } })
