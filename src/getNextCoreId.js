export default function getNextCoreId(doc) {
  let lastCoreId = doc._lastCoreId
  if (lastCoreId === undefined) {
    lastCoreId = -1
  }
  const nextCoreId = lastCoreId + 1
  doc._lastCoreId = nextCoreId
  return nextCoreId
}
