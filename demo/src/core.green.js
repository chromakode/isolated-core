import { coreInit } from 'isolated-core'

const CSS2 = { __html: require('./style2.less') }

coreInit({
  scriptURL: 'green.js',
  run: core => {
    const React = require('react')
    const DemoUI = require('./DemoUI').default

    // Monkeypatch in some extra render nodes.
    const origRender = DemoUI.prototype.render
    DemoUI.prototype.render = function render() {
      return (
        <div>
          {origRender.apply(this)}
          <style dangerouslySetInnerHTML={CSS2} />
        </div>
      )
    }

    DemoUI.prototype.isGreen = true

    require('./').init(core)
  },
})
