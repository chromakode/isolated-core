export default function scriptsToHTML(scripts, onError) {
  const scriptContainerEl = document.createElement('div')
  scripts.forEach(scriptAttrs => {
    const scriptEl = document.createElement('script')

    if (typeof scriptAttrs === 'string') {
      scriptEl.src = scriptAttrs
    } else {
      for (const attrName in scriptAttrs) {
        if (!scriptAttrs.hasOwnProperty(attrName)) {
          continue
        }
        scriptEl.setAttribute(attrName, scriptAttrs[attrName])
      }
    }

    scriptEl.setAttribute('onerror', onError)
    scriptContainerEl.appendChild(scriptEl)
  })
  const caseNormalized = scriptContainerEl.innerHTML
    .replace('<SCRIPT ', '<script ')
    .replace('</SCRIPT>', '</script>')
  return caseNormalized
}
