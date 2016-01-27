export default function scriptsToHTML(scripts, onError) {
  const tags = scripts.map(scriptAttrs => {
    const attrStrings = []
    if (typeof scriptAttrs === 'string') {
      attrStrings.push(`src="${scriptAttrs}"`)
    } else {
      for (const attrName in scriptAttrs) {
        if (attrName === 'onerror' || !scriptAttrs.hasOwnProperty(attrName)) {
          continue
        }
        attrStrings.push(`${attrName}="${scriptAttrs[attrName]}"`)
      }
    }
    attrStrings.push(`onerror="${onError}"`)

    const attrsString = attrStrings.join(' ')
    return `<script ${attrsString}></script>`
  })
  return tags.join('')
}
