import expect from 'expect'
import getNextCoreId from '../src/getNextCoreId'

describe('getNextCoreId', () => {
  it('increments on each call and sets doc._lastCoreID', () => {
    const fakeDoc = {}
    expect(getNextCoreId(fakeDoc)).toBe(0)
    expect(fakeDoc._lastCoreId).toBe(0)
    expect(getNextCoreId(fakeDoc)).toBe(1)
    expect(fakeDoc._lastCoreId).toBe(1)
  })
})
