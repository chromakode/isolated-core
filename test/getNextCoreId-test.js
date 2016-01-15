import expect from 'expect'
import getNextCoreId from '../src/getNextCoreId'

describe('getNextCoreId', () => {
  it('increments on each call and sets doc._lastCoreID', () => {
    const fakeWin = {}
    const fakeDoc = { defaultView: fakeWin }
    expect(getNextCoreId(fakeDoc)).toBe(0)
    expect(fakeWin._lastCoreId).toBe(0)
    expect(getNextCoreId(fakeDoc)).toBe(1)
    expect(fakeWin._lastCoreId).toBe(1)
  })
})
