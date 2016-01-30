import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { loadCore } from 'isolated-core'
import CoreStatus from './CoreStatus'

const CSS = { __html: require('./style.less') }

export default class DemoUI extends Component {
  constructor(props) {
    super(props)

    this.state = {
      firstCore: {},
      errorCore: {},
      nonexistentCore: {},
    }
  }

  loadCore(name, url, args) {
    if (this.state[name].coreRef) {
      this.state[name].coreRef.destroyCore()
    }

    this.setState({
      [name]: {
        loading: true,
      },
    })

    loadCore({
      scriptURL: url,
      args,
    }).then(
      coreRef => {
        this.setState({
          [name]: {
            loading: false,
            ready: true,
            coreRef,
          },
        })
      },
      coreErr => {
        this.setState({
          [name]: {
            error: coreErr.type,
            errorDetail: coreErr.src || coreErr.err,
          },
        })
        console.error(`core #${coreErr.id} failed to load: ${coreErr.type} error`) // eslint-disable-line no-console
        coreErr.destroyCore()
      }
    )
  }

  launchCore(name) {
    this.state[name].coreRef.launchCore()
  }

  render() {
    const firstCoreReady = this.state.firstCore.ready
    const didReload = this.props.core.args && this.props.core.args.reloaded
    const onFirstStep = !firstCoreReady && !didReload
    const isDone = didReload && !firstCoreReady
    return (
      <div>
        <style dangerouslySetInnerHTML={CSS} />
        <div className="title">
          <div className="inner">
            <a href="https://chromakode.github.io/isolated-core/"><h1><span className="box">Isolated Core</span></h1></a>
          </div>
        </div>
        <div className="description">
          <div className="inner">
            <h2>Isolated Core makes production in-page updates simple, fast, and reliable.</h2>
          </div>
        </div>
        <div className="content">
          <h3>Here, let's try reloading the page: <CoreStatus {...this.state.firstCore} /> {firstCoreReady && <span className="scroll-notice">(scroll down)</span>}</h3>
          <ol className="steps">
            <li className={classNames({ 'current': onFirstStep || isDone })}>
              <button onClick={() => this.loadCore('firstCore', this.isGreen ? 'main.js' : 'green.js', { reloaded: true })} disabled={this.state.firstCore.loading || firstCoreReady}>{isDone ? 'Want to see that again?' : 'Load and init a new update inside an <iframe>.'}</button>
              <p>In Isolated Core, your JavaScript app code (the "core") executes within an iframe.<br /> To load an update, we create a new iframe and initialize it beside the current one.</p>
              <aside>Because it's running in a separate window context, the new version starts from a blank slate and initializes in the background without affecting our running app. Open your JS console for details.</aside>
            </li>
            <li className={classNames({ 'current': !onFirstStep || isDone, 'done': isDone })}>
              <button onClick={() => this.launchCore('firstCore')} disabled={isDone}>{isDone ? `Done! Hello from core #${this.props.core.id}.` : 'Perform an update by swapping cores. Don\'t blink!'}</button>
              <p>We just swapped out our entire running app from a cold start with no jank!<br /> To swap cores, we detach the current core from the DOM, tell the new one to attach, and remove the old iframe.</p>
              <aside>Since we've already initialized the new version right up to its first render() call, the actual swap is crazy fast. Isolated Core takes full advantage of frameworks like React that attach to existing nodes non-destructively. Even though we just completely swapped out our JS codebase, we attach to the existing DOM.</aside>
            </li>
          </ol>
          <hr />

          <h3>How it works:</h3>
          <div className="diagram-step">
            <p>On page load, our entry point script executes.</p>
            <div className="diagram">
              <div className="box page">
                <code className="label">index.html</code>
                <code className="inside">{'<script src="main.js"></script>'}</code>
              </div>
            </div>
          </div>
          <div className="diagram-step">
            <p>The first thing it does is create a starting iframe, inject a script tag into it, and exit.</p>
            <div className="diagram">
              <div className="box page">
                <code className="label">{'index.html'}</code>
                <div className="inside">
                  <div className="box core0">
                    <code className="label">{'<iframe data-coreid="0" />'}</code>
                    <code className="inside">{'<script src="main.js"></script>'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="diagram-step">
            <p>The script executes again, but now that it detects it's inside a core frame, it initializes. Since it's the first core, its attach() method is automatically called, rendering UI to the parent document.</p>
            <div className="diagram">
              <div className="box page">
                <code className="label">{'index.html'}</code>
                <div className="inside">
                  <code className="minor">{'<div id="ui">hello, core #0!<div>'}</code>
                  <div className="box core0">
                    <code className="label">{'<iframe data-coreid="0" data-core-active />'}</code>
                    <code className="inside">{'<script src="main.js"></script>'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="diagram-step">
            <p>To load an update, the second core iframe is created and a script tag is injected. It loads and initializes in the background, but it doesn't attach() right away.</p>
            <div className="diagram">
              <div className="box page">
                <code className="label">{'index.html'}</code>
                <div className="inside">
                  <code className="minor">{'<div id="ui">hello, core #0!</div>'}</code>
                  <div className="box core0">
                    <code className="label">{'<iframe data-coreid="0" data-core-active />'}</code>
                    <code className="inside">{'<script src="main.js"></script>'}</code>
                  </div>
                  <div className="box core1">
                    <code className="label">{'<iframe data-coreid="1" />'}</code>
                    <code className="inside">{'<script src="main.1.js"></script>'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="diagram-step">
            <p>When the second core is ready, it signals the current core and it offers the update to the user. Finally, we swap out the cores by calling detach() on core #0, calling attach() on core #1, and removing iframe #0 from the DOM.</p>
            <div className="diagram">
              <div className="box page">
                <code className="label">{'index.html'}</code>
                <div className="inside">
                  <code className="minor">{'<div id="ui">hello, core #1!</div>'}</code>
                  <div className="box core1">
                    <code className="label">{'<iframe data-coreid="1" data-core-active />'}</code>
                    <code className="inside">{'<script src="main.1.js"></script>'}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr />

          <h3>Isolated Core makes your updates resilient to failure.</h3>
          <p>Both network and JS errors all the way up to the initial attach() can be caught and handled before users even know there was an update.</p>
          <p>Let's try loading an update that throws an exception:</p>
          <button onClick={() => this.loadCore('errorCore', 'error.js')}>Load crash.js</button> <CoreStatus {...this.state.errorCore} />
          <p>Alternatively, a nonexistent update:</p>
          <button onClick={() => this.loadCore('nonexistentCore', '404.js')}>Load 404.js</button> <CoreStatus {...this.state.nonexistentCore} />
          <p>This eliminates a large class of gotchas that cause updates to fail. Further, this can catch the tricky sort of bugs that only show up in production due to specific browser/platform idiosyncracies. You can get additional mileage from this technique by treating core setup as a "health check" &mdash; the more you cover in initialization, the greater confidence you have that an update will succeed.</p>
          <p>When combined with an exception tracking tool like <a href="https://getsentry.com">Sentry</a>, it's easy to get immediate feedback when releases break (transparently to the affected users!) You can even smoke-test releases live on real world machines by pushing unit tests to a sampling of clients before rollouts.</p>

          <h3>Cold starts are predictable and easy to reason about.</h3>
          <p>It's tricky to ensure that an update will work consistently regardless of what state the app is in. When replacing individual components, special care needs to be taken to transfer and clean up old state. This makes it challenging to predict problems that may occur when an app has been running for a long time.</p>

          <p>Developers bias towards finding issues early in the app lifetime because they frequently re-run the initialization process by reloading the page. When testing the initialization of an app from a blank slate, you only have one case to handle, but when testing updates in a running app, you must consider all cases.</p>

          <p>With Isolated Core, updates are the same case as initialization. Both initial page loads and updates run the same code branches in an empty iframe. The only thing that differs during an update is the extra detach step of the old core. A crash running an update should correspond to a crash on app startup, making it easier to spot issues in development.</p>

          <h3>Getting Started</h3>
          <p><a href="https://github.com/chromakode/isolated-core">Isolated Core</a> is available on GitHub under the <a href="https://github.com/chromakode/isolated-core/blob/master/LICENSE">MIT license.</a> You can also npm install <a href="https://www.npmjs.com/package/isolated-core">isolated-core</a>.</p>
          <p>See the <a href="https://github.com/chromakode/isolated-core#usage">usage section of the README</a> for a guide on how to integrate it into your app.</p>
          <p>Isolated Core is compatible with IE9+ and all modern browsers.</p>
          <hr />

          <div className="badges">
            <p><a href="https://travis-ci.org/chromakode/isolated-core"><img src="https://img.shields.io/travis/chromakode/isolated-core/master.svg?style=flat-square" alt="Travis status" /></a> <a href="https://coveralls.io/github/chromakode/isolated-core?branch=master"><img src="https://img.shields.io/coveralls/chromakode/isolated-core/master.svg?style=flat-square" alt="Coveralls status" /></a> <a href="https://www.npmjs.com/package/isolated-core"><img src="https://img.shields.io/npm/v/isolated-core.svg?style=flat-square" alt="NPM listing" /></a> <a href="https://github.com/chromakode/isolated-core/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/isolated-core.svg?style=flat-square" alt="MIT license" /></a></p>
            <a href="https://saucelabs.com/u/isolated-core"><img src="https://saucelabs.com/browser-matrix/isolated-core.svg" className="sauce-matrix" alt="Browser compatibility matrix" /></a>
          </div>
        </div>
        <footer>
          <a href="http://chromakode.com">
            <svg className="logo" viewBox="0 0 32 32">
              <circle r="4.8156" cy="6.2955" cx="10.3971" />
              <circle r="4.8156" cy="6.2955" cx="21.6028" />
              <circle r="4.8156" cx="4.794302" cy="16" />
              <circle r="4.8156" cx="16" cy="16" />
              <circle r="4.8156" cx="27.2057" cy="16" />
              <circle r="4.8156" cx="21.6028" cy="25.7045" />
              <circle r="4.8156" cx="10.3971" cy="25.7045" />
            </svg>
            chromakode
          </a> / 2016
        </footer>
        <a href="https://github.com/chromakode/isolated-core"><img className="ribbon" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" /></a>
      </div>
    )
  }
}

DemoUI.propTypes = {
  core: PropTypes.object.isRequired,
}
