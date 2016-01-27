import expect from 'expect'
import scriptsToHTML from '../src/utils/scriptsToHTML'

describe('scriptsToHTML', () => {
  it('converts a scripts object into an HTML string', () => {
    function ProtoTest() {}
    ProtoTest.prototype = { foo: 'bar' }

    const scripts = [
      'string.js',
      Object.assign(new ProtoTest(), { src: 'Test.js' }),
      { src: 'async.js', async: true, onerror: 'nope' },
    ]
    const result = scriptsToHTML(scripts, 'test(this.src)')
    const expectedResult = `
      <script src="string.js" onerror="test(this.src)"></script>
      <script src="Test.js" onerror="test(this.src)"></script>
      <script src="async.js" async="true" onerror="test(this.src)"></script>
    `.replace(/\n\s*/g, '')
    expect(result).toBe(expectedResult)
  })
})
