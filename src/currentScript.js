export function getCurrentScript(doc) {
  if (doc.currentScript) {
    return doc.currentScript
  }

  const scripts = doc.getElementsByTagName('script')
  return scripts[scripts.length - 1]
}

const currentScript = getCurrentScript(document)
export default currentScript
