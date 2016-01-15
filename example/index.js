import React from 'react'
import ReactDOM from 'react-dom'
import DemoUI from './DemoUI'

export function init(core) {
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
