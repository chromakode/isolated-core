import expect, { createSpy, spyOn } from 'expect'
import { coreInit, loadCore } from '../src/'

function checkCoreInfo(coreInfo) {
  expect(coreInfo.id).toBe(0)
  expect(coreInfo.args).toBe(undefined)
  expect(coreInfo.destroyCore).toBeA('function')
  const envEl = document.querySelector(`[data-coreid="${coreInfo.id}"]`)
  expect(coreInfo.context).toBe(envEl.contentWindow)
}

describe('loadCore', () => {
  let coreEvent

  beforeEach(() => {
    window._core = {
      uidocument: document,
    }
    coreEvent = window.top.coreEvent = createSpy()
  })

  afterEach(() => {
    delete window.top.coreEvent
    delete window._lastCoreId
    expect(document.querySelector('[data-coreid]')).toBe(null, 'Expected core to be destroyed after test')
  })

  it('creates an iframe containing scripts with data-coreid attribute set, and removes when destroyed', () => {
    return loadCore({
      scripts: [{ src: '/base/test/fixtures/spyCore.js', id: 'test' }],
    }).then(coreRef => {
      const envEl = coreRef.context.frameElement
      expect(envEl.getAttribute('data-coreid')).toBe('0')
      expect(envEl.parentNode).toBe(document.body)
      expect(envEl.contentDocument.doctype.name).toBe('html')

      const expectedHTML = `
        <html>
          <head>
          </head>
          <body>
            <script src="/base/test/fixtures/spyCore.js" id="test" onerror="_core.onLoadError(this.src)"></script>
          </body>
        </html>
      `.replace(/\n\s*/g, '')
      expect(envEl.contentDocument.documentElement.outerHTML).toBe(expectedHTML)

      coreRef.destroyCore()
      expect(envEl.parentNode).toBe(null)
    })
  })

  it('populates iframe context with _core data', () => {
    const args = { it: 'works' }
    return loadCore({
      scripts: ['/base/test/fixtures/spyCore.js'],
      args,
    }).then(coreRef => {
      const coreData = coreRef.context._core
      expect(coreData.id).toBe(0)
      expect(coreData.uidocument).toBe(document)
      expect(coreData.args).toBe(args)
      expect(coreData.onReady).toBeA('function')
      expect(coreData.onExecutionError).toBeA('function')
      expect(coreData.onLoadError).toBeA('function')
      coreRef.destroyCore()
    })
  })

  it('when a core becomes ready, saves handlers to coreData and resolves with a coreInfo object containing a launchCore method', () => {
    return loadCore({
      scripts: ['/base/test/fixtures/spyCore.js'],
    }).then(coreRef => {
      expect(coreEvent.calls[1].arguments[0]).toBe('ready')
      const handlers = coreEvent.calls[1].arguments[2]

      const coreData = coreRef.context._core
      expect(coreData.attach).toBe(handlers.attach)
      expect(coreData.detach).toBe(handlers.detach)

      checkCoreInfo(coreRef)
      expect(coreRef.launchCore).toBeA('function')
      const operations = require('../src/operations')
      const swapCoreSpy = spyOn(operations, 'swapCore')
      coreRef.launchCore()
      expect(swapCoreSpy).toHaveBeenCalledWith(window, coreRef.context, document)
      swapCoreSpy.restore()

      coreRef.destroyCore()
    })
  })

  it('executes scripts in order specified', () => {
    const scriptOrder = []
    coreEvent.andCall((name, param) => {
      if (name === 'init' || name === 'script-run') {
        scriptOrder.push(param.args.order)
      }
    })

    const scripts = []
    const expectedOrder = []
    let i
    for (i = 0; i < 100; i++) {
      scripts.push({ src: '/base/test/fixtures/countScript.js', id: i })
      expectedOrder.push(i)
    }
    scripts.push('/base/test/fixtures/spyCore.js')
    expectedOrder.push(i)

    return loadCore({
      scripts,
      args: { order: i },
    }).then(coreRef => {
      expect(scriptOrder).toEqual(expectedOrder)
      coreRef.destroyCore()
    })
  })

  it('launchCore method swaps with current core, sets data-core-active attribute, and destroys the previous core', () => {
    delete window._core

    function expectCoreEvent(index, name, coreId, thirdArgument) {
      expect(coreEvent.calls[index].arguments[0]).toBe(name)
      expect(coreEvent.calls[index].arguments[1].id).toBe(coreId)
      if (thirdArgument) {
        expect(coreEvent.calls[index].arguments[2]).toBe(thirdArgument)
      }
    }

    return coreInit({
      scripts: ['/base/test/fixtures/spyCore.js'],
    }).then(firstCoreRef => {
      expect(firstCoreRef.id).toBe(0)
      const firstEnvEl = firstCoreRef.context.frameElement
      expect(firstEnvEl.parentNode).toBe(document.body)
      expect(firstEnvEl.getAttribute('data-coreid')).toBe('0')
      expect(firstEnvEl.getAttribute('data-core-active')).toBe('')
      expectCoreEvent(0, 'init', 0)
      expectCoreEvent(1, 'ready', 0)
      expectCoreEvent(2, 'attach', 0, document)

      return firstCoreRef.context.loadNextCore().then(secondCoreRef => {
        expect(secondCoreRef.id).toBe(1)
        const secondEnvEl = secondCoreRef.context.frameElement
        expect(secondEnvEl.getAttribute('data-coreid')).toBe('1')
        expect(secondEnvEl.getAttribute('data-core-active')).toBe(null)
        expectCoreEvent(3, 'init', 1)
        expectCoreEvent(4, 'ready', 1)

        secondCoreRef.launchCore()

        expectCoreEvent(5, 'detach', 0, document)
        expectCoreEvent(6, 'attach', 1, document)
        expect(firstEnvEl.getAttribute('data-core-active')).toBe(null)
        expect(firstEnvEl.parentNode).toBe(null)
        expect(secondEnvEl.getAttribute('data-core-active')).toBe('')

        secondCoreRef.destroyCore()
      })
    })
  })

  it('rejects if a script throws an exception with an errInfo object, and removes when destroyed', () => {
    return loadCore({
      scripts: ['/base/test/fixtures/errorCore.js'],
    }).then(
      () => {
        throw new Error('Expected promise to be rejected')
      },

      errInfo => {
        checkCoreInfo(errInfo)

        expect(errInfo.type).toBe('js')
        expect(errInfo.err).toExist()
        expect(errInfo.err.message).toBe('oh noes!')

        const envEl = errInfo.context.frameElement
        expect(envEl.parentNode).toBe(document.body)
        errInfo.destroyCore()
        expect(envEl.parentNode).toBe(null)
      }
    )
  })

  it('rejects if a script fails to load with an errInfo object, and removes when destroyed', () => {
    return loadCore({
      scripts: ['/base/test/fixtures/nonexistent.js'],
    }).then(
      () => {
        throw new Error('Expected promise to be rejected')
      },

      errInfo => {
        checkCoreInfo(errInfo)

        expect(errInfo.type).toBe('request')
        expect(errInfo.src).toBe(document.location.origin + '/base/test/fixtures/nonexistent.js')

        const envEl = errInfo.context.frameElement
        expect(envEl.parentNode).toBe(document.body)
        errInfo.destroyCore()
        expect(envEl.parentNode).toBe(null)
      }
    )
  })
})
