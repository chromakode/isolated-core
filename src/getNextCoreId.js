export default function getNextCoreId(doc) {
  let lastCoreId = doc.defaultView._lastCoreId
  if (lastCoreId === undefined) {
    lastCoreId = -1
  }
  const nextCoreId = lastCoreId + 1
  doc.defaultView._lastCoreId = nextCoreId
  return nextCoreId
}
