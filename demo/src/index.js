import React from 'react'
import ReactDOM from 'react-dom'
import DemoUI from './DemoUI'

export function init(core) {
  if (process.env.NODE_ENV !== 'production') {
    require('webpack/hot/dev-server')
    require('webpack-dev-server/client?http://0.0.0.0:8080')
  }

  console.info(`core #${core.id} loaded`)  // eslint-disable-line no-console

  core.ready({
    attach(uidocument) {
      ReactDOM.render(
        <DemoUI
          core={core}
        />,
        uidocument.getElementById('container')
      )
      console.info(`core #${core.id} attached`)  // eslint-disable-line no-console
    },

    detach(uidocument) {
      ReactDOM.unmountComponentAtNode(uidocument.getElementById('container'))
      console.info(`core #${core.id} detached`)  // eslint-disable-line no-console
    },
  })
}
