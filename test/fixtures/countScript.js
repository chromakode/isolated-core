let currentScript = document.currentScript
if (!currentScript) {
  const scripts = document.getElementsByTagName('script')
  currentScript = scripts[scripts.length - 1]
}
const scriptId = Number(currentScript.id)
window.top.coreEvent('script-run', { args: { order: scriptId } })
