import expect, { createSpy } from 'expect'
import noop from '../src/utils/noop'
import {
  destroyCore,
  detachCore,
  attachCore,
  swapCore,
} from '../src/operations'

function mockCallback() {}
function mockWin() {
  return {
    _core: {
      attach: createSpy(),
      detach: createSpy(),
      onReady: mockCallback,
      onExecutionError: mockCallback,
      onLoadError: mockCallback,
    },
    frameElement: {
      setAttribute: createSpy(),
      removeAttribute: createSpy(),
      parentNode: {
        removeChild: createSpy(),
      },
    },
  }
}

function expectDestroyed(fakeWin) {
  expect(fakeWin._core.onReady).toBe(noop)
  expect(fakeWin._core.onExecutionError).toBe(noop)
  expect(fakeWin._core.onLoadError).toBe(noop)
  expect(fakeWin.frameElement.parentNode.removeChild).toHaveBeenCalledWith(fakeWin.frameElement)
}

function expectDetached(fakeWin, fakeDoc) {
  expect(fakeWin.frameElement.removeAttribute).toHaveBeenCalledWith('data-core-active')
  expect(fakeWin._core.detach).toHaveBeenCalledWith(fakeDoc)
}

function expectAttached(fakeWin, fakeDoc) {
  expect(fakeWin.frameElement.setAttribute).toHaveBeenCalledWith('data-core-active', '')
  expect(fakeWin._core.attach).toHaveBeenCalledWith(fakeDoc)
}

describe('core operations', () => {
  describe('destroyCore', () => {
    it('sets callbacks to noops and removes frame element', () => {
      const fakeWin = mockWin()
      destroyCore(fakeWin)
      expectDestroyed(fakeWin)
    })
  })

  describe('detachCore', () => {
    it('removes data-core-active attribute and calls detach handler', () => {
      const fakeDoc = {}
      const fakeWin = mockWin()
      detachCore(fakeWin, fakeDoc)
      expectDetached(fakeWin, fakeDoc)
    })
  })

  describe('attachCore', () => {
    it('sets data-core-active attribute and calls attach handler', () => {
      const fakeDoc = {}
      const fakeWin = mockWin()
      attachCore(fakeWin, fakeDoc)
      expectAttached(fakeWin, fakeDoc)
    })
  })

  describe('setupCore', () => {
    it('calls setup handler if a handler exists')
    it('does not call setup handler if a handler does not exist')
  })

  describe('swapCore', () => {
    it('detaches current context, attaches next context, and destroys current context', () => {
      const fakeDoc = {}
      const fakeWin = mockWin()
      const fakeNextWin = mockWin()
      swapCore(fakeWin, fakeNextWin, fakeDoc)
      expectDetached(fakeWin, fakeDoc)
      expectAttached(fakeNextWin, fakeDoc)
      expectDestroyed(fakeWin)
    })
  })
})
