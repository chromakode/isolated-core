import React, { Component, PropTypes } from 'react'
import { loadCore } from 'isolated-core'

const CSS = { __html: `
body {
  font-family: sans-serif;
  margin: 25px;
  max-width: 500px;
}

.info {
  margin: 1em 0;
}

h2 {
  margin: .25em 0;
}

p.error {
  color: red;
  font-weight: bold;
  margin-bottom: 0;
}

.action {
  min-height: 2em;
  padding: 1em;
  background: #eee;
}

.action, .action form {
  display: flex;
  align-items: center;
}

.action > * {
  flex: 1;
}

.action label {
  margin-right: .5em;
}

.action select {
  flex: 1;
}

button, select {
  font-size: 1em;
  padding: .25em .5em;
  margin-right: .15em;
  align-self: stretch;
}

.ready {
  color: green;
  font-weight: bold;
  width: 100%;
}

.ribbon {
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
}
` }

export default class DemoUI extends Component {
  constructor(props) {
    super(props)

    const now = new Date()
    this.state = {
      startTime: now,
      currentTime: now,
      loading: false,
      selectedCore: '/main.js',
      readyCore: null,
      coreError: null,
    }

    window.setInterval(this.handleTick.bind(this), 1000 / 60)
  }

  handleTick() {
    const now = new Date()
    if (now > Math.ceil(this.state.currentTime / 1000) * 1000) {
      console.debug(`core ${this.props.core.id} running`)  // eslint-disable-line no-console
    }
    this.setState({ currentTime: now })
  }

  handleSelectCore(ev) {
    this.setState({
      selectedCore: ev.target.value,
    })
  }

  handleLoadCore(ev) {
    ev.preventDefault()

    this.setState({
      loading: true,
    })

    loadCore({
      scripts: [this.state.selectedCore],
    }).then(
      coreRef => {
        this.setState({
          loading: false,
          readyCore: coreRef,
          coreError: null,
        })
      },
      coreErr => {
        this.setState({
          loading: false,
          readyCore: null,
          coreError: coreErr.type,
        })
        console.error(`core #${coreErr.id} failed to load: ${coreErr.type} error`) // eslint-disable-line no-console
        coreErr.destroyCore()
      }
    )
  }

  handleLaunch() {
    this.state.readyCore.launchCore()
  }

  render() {
    let action
    if (this.state.readyCore) {
      action = (
        <button
          className="ready"
          onClick={() => this.handleLaunch()}
        >Core ready! Click to launch.</button>
      )
    } else {
      action = (
        <div>
          <form className="load" onSubmit={ev => this.handleLoadCore(ev)}>
            <label>Choose a version to load:</label>
            <select
              selected={this.state.selectedCore}
              onChange={ev => this.handleSelectCore(ev)}
            >
              <option value="main.js">Normal</option>
              <option value="green.js">Green Background</option>
              <option value="slow.js">Slow Init</option>
              <option value="error.js">Init Error</option>
              <option value="404.js">404</option>
            </select>
            <button
              disabled={this.state.loading || this.state.readyCore}
            >Load</button>
          </form>
          {this.state.coreError && <p className="error">Core failed to load: {this.state.coreError} error.</p>}
        </div>
      )
    }

    const runningTime = (this.state.currentTime - this.state.startTime) / 1000
    return (
      <div>
        <h1>Isolated Core Demo</h1>
        <p>Isolated Core enables seamless in-page updating via iframes.</p>
        <p><strong>Instructions:</strong> Select a core and click 'Load'. The core will load in the background inside an iframe, signalling the page when it is ready to be launched. Launching a core will attach the new core to the document and unload the current core. Open the JS console to view details.</p>
        <p>Watch the clock to observe pauses when new cores are loaded.</p>
        <div className="action">
          {action}
        </div>
        <div className="info">
          <h2>Current core: #{this.props.core.id}</h2>
          <h2>Time since started: {runningTime.toFixed(2)}</h2>
        </div>
        <style dangerouslySetInnerHTML={CSS} />
        <a href="https://github.com/chromakode/isolated-core"><img className="ribbon" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" /></a>
      </div>
    )
  }
}

DemoUI.propTypes = {
  core: PropTypes.object.isRequired,
}
