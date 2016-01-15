import expect from 'expect'
import { currentScript } from '../src/'
import { getCurrentScript } from '../src/currentScript'

describe('currentScript', () => {
  it('is correct in this browser', () => {
    expect(currentScript.src).toInclude('/base/test/tests.webpack.js')
  })
})

describe('getCurrentScript', () => {
  describe('if document.currentScript exists', () => {
    it('returns document.currentScript', () => {
      const mockDocument = { currentScript: { src: '/script.js' } }
      expect(getCurrentScript(mockDocument).src).toBe('/script.js')
    })
  })

  describe('if document.currentScript not supported', () => {
    it('returns the last script in the document', () => {
      const envEl = document.createElement('iframe')
      document.body.appendChild(envEl)
      const firstScriptEl = document.createElement('script')
      firstScriptEl.src = '/base/test/fixtures/countScript.js?1'
      envEl.contentDocument.body.appendChild(firstScriptEl)
      const secondScriptEl = document.createElement('script')
      secondScriptEl.src = '/base/test/fixtures/countScript.js?2'
      envEl.contentDocument.body.appendChild(secondScriptEl)
      expect(getCurrentScript(envEl.contentDocument).src).toBe(secondScriptEl.src)
      document.body.removeChild(envEl)
    })
  })
})
