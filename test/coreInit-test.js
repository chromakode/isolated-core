import expect, { createSpy } from 'expect'
import { coreInit } from '../src/'

describe('coreInit', () => {
  describe('called in a top-level script', () => {
    let coreEvent

    beforeEach(() => {
      coreEvent = window.top.coreEvent = createSpy()
    })

    afterEach(() => {
      delete window.top.coreEvent
      delete document._lastCoreId
    })

    it('loads and attaches the first core', () => {
      const fakeRun = createSpy()

      return coreInit({
        scriptURL: '/base/test/fixtures/spyCore.js',
        run: fakeRun,
      }).then(coreRef => {
        expect(fakeRun).toNotHaveBeenCalled()
        expect(coreEvent.calls[0].arguments[0]).toEqual('init')
        expect(coreEvent.calls[1].arguments[0]).toEqual('ready')
        expect(coreEvent.calls[2].arguments[0]).toEqual('attach')
        expect(coreEvent.calls[2].arguments[2]).toEqual(document)
        expect(coreRef.context.frameElement.getAttribute('data-core-active')).toBe('')
        coreRef.destroyCore()
      })
    })
  })

  describe('called in a core', () => {
    beforeEach(() => {
      window._core = {
        id: 0,
        args: undefined,
        onExecutionError: createSpy(),
        onReady: createSpy(),
      }
    })

    afterEach(() => {
      delete window._core
    })

    it('passes core data object to run function', () => {
      coreInit({
        scriptURL: '/base/test/fixtures/spyCore.js',
        run: core => {
          expect(core.id).toBe(0)
          expect(core.args).toBe(undefined)
          expect(core.ready).toBeA('function')

          const mockHandlers = { attach() {}, detach() {} }
          core.ready(mockHandlers)
          expect(window._core.onReady).toHaveBeenCalledWith(mockHandlers)
        },
      })
    })

    it('if run function throws, calls onExecutionError handler and re-throws', () => {
      const fakeError = new Error('oh noes!')
      try {
        coreInit({
          scriptURL: '/base/test/fixtures/spyCore.js',
          run: () => {
            throw fakeError
          },
        })
      } catch (err) {
        expect(err).toBe(fakeError)
      }
      expect(window._core.onExecutionError).toHaveBeenCalledWith(fakeError)
    })
  })
})
