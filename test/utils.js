export function cacheBust(url) {
  const karma = window.top.karma
  if (karma && karma.files.hasOwnProperty(url)) {
    return url + '?' + karma.files[url]
  }
  return url + '?' + String(Math.random()).substr(2)
}
