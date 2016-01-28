# Isolated Core

[![Build Status](https://img.shields.io/travis/chromakode/isolated-core/master.svg?style=flat-square)](https://travis-ci.org/chromakode/isolated-core)
[![Coverage Status](https://img.shields.io/coveralls/chromakode/isolated-core/master.svg?style=flat-square)](https://coveralls.io/github/chromakode/isolated-core?branch=master)

:construction: **Under Construction** :construction:

:zap: A library for seamless in-page cold updates using iframes. [Demo](http://chromakode.github.io/isolated-core/).


## Introduction

In long running web apps, such as chat clients or music players, users leave pages open for weeks. It's desirable to be able to push new code updates to them, but in-page updates must be extremely fast and reliable to not become disruptive to the user experience.

With Isolated Core, your client-side JS (the "core") is contained within an `<iframe>`. To render UI, the iframe reaches up to manipulate the DOM of its parent document. This pattern decouples app execution from the visible UI, making it possible to seamlessly reload the entire app separately from the page without navigation or jank. This has some cool advantages:

 * Speed: updates load in the background and "swapping cores" is extremely fast.
 * Fault-tolerance: network and JS errors during init are caught before performing an update.
 * Predictabilty: loading an update runs the same code paths as reloading the page.

Isolated Core is complementary to existing techniques like [Hot Module Replacement (HMR)](https://webpack.github.io/docs/hot-module-replacement-with-webpack.html) and is framework agnostic. Unlike HMR, Isolated Core reloads your entire app environment \*cold\*, from a blank slate. This makes updates predictable and easy to reason about, and facilitates updating components that previously required a full page reload. In addition, Isolated Core makes rollouts safer: since updates load and initialize in the background, failures can be caught rapidly and without disrupting the user.


## Example

You can find a demo codebase demonstrating reloading using Isolated Core in the [example](https://github.com/chromakode/isolated-core/tree/master/example) directory of this repo. You can also [view the demo in your browser](http://chromakode.github.io/isolated-core/).


## Usage

In the entry point of your app, call `coreInit`, passing it the URL to the current script and a function to run to initialize your app. When `coreInit` is first invoked from a script tag, it will create a new iframe, injecting the script you specify. Then, inside the iframe, your script runs again and `coreInit` calls the `run` function you specify.

This design makes Isolated Core compatible with a [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP/Introducing_Content_Security_Policy) and browsers which do not support Data URIs in iframes.

**main.js:**

```js
import { coreInit } from 'isolated-core'

coreInit({
  // In non-IE, you can use document.currentScript.src here.
  scriptURL: '/main.js',

  // Note: we are deferring require()ing our code until the "run" function
  // executes inside the iframe. Our init function is exported by index.js.
  run: core => require('./').init(core),
})
```

In your initialization function, take a `core` argument and call `core.ready()` with handlers to `attach` and `detach` your UI. These handlers are responsible for instantiating and decontructing your UI in the parent document when your core is loaded or replaced. Both of these handlers receive the parent document ("uidocument") as an argument. For example, here's a basic React setup:

**index.js:**

```js
import React from 'react'
import ReactDOM from 'react-dom'
import MyComponent from './MyComponent'

export function init(core) {
  core.ready({
    attach(uidocument) {
      ReactDOM.render(<MyComponent />, uidocument.getElementById('container'))
    },

    detach(uidocument) {
      ReactDOM.unmountComponentAtNode(uidocument.getElementById('container'))
    },
  })
}
```

When `coreInit` creates the first iframe, it automatically attaches it, calling your attach handler.

To load an update, call `loadCore` with a script URL to execute. It returns a promise which resolves when the new core is loaded and ready to attach. It rejects if a script request fails to load (script tag `onerror`) or a JS exception is thrown during initialization. Under the hood, `loadCore` is creating a new iframe, injecting the script specified. Inside the new iframe, `coreInit` runs like before, and when it calls `core.ready()`, the promise resolves. For example:

```js
loadCore({
  scriptURL: '/main.js',
}).then(
  function success(coreRef) => {
    // Call launchCore to detach the current core and attach the new one.
    coreRef.launchCore()
  },

  function failure(coreErr) {
    // coreErr.type will be either "request" or "js"
    // "request" type errors have a "src" property with the URL that failed to load.
    // "js" type errors have an "err" property with the exception.
    console.error(`core #${coreErr.id} failed to load: ${coreErr.type} error`)

    // Call destroyCore to remove the iframe from the document.
    coreErr.destroyCore()
  }
)
```

Finally, you should use CSS to hide core iframes. The easiest way to do it is to match the `data-coreid` attribute:

```css
iframe[data-coreid] { display: none }
```


## API

### `coreInit({ scriptURL, run, args })`

Initialize the core, creating the first iframe if necessary.

When called outside a core iframe, `coreInit` passes its options to `loadCore` and automatically attaches the first core when it's ready.

When called inside a core iframe, `coreInit` invokes the `run` function with a `core` object, e.g.:

```js
{
  id: 0,              // A unique numeric id for the core
  args: {...},        // An object passed to loadCore by the invoking context
  ready: <function>,  // Call with a handlers object when finished loading
}
```

The `core.ready()` function must be called by your `run` function when your core is ready to attach:

```js
core.ready({
  attach(uidocument) {
    // render your UI to uidocument
  }

  detach(uidocument) {
    // clean up your event handlers, etc.
  }
})
```

### `loadCore({ scriptURL, args })`

Load a new core with specified `args` by creating an iframe and injecting a script with the specified `scriptURL` into it. Returns a promise which resolves when the core is ready to attach, or rejects in case of request or JS error.

When the promise resolves or rejects, it passes an object of the form:

```js
{
  id: 0,                    // A unique numeric id for the core
  args: {...},              // The args object you specified
  context: <window>,        // A reference to the window object of the iframe
  destroyCore: <function>,  // Call to remove the core's iframe
}
```

If the promise resolves, the return type will also include:

```js
{
  launchCore: <function>,   // Call to detach the current core and attach this new one
}
```

Calling `launchCore` will remove the current execution context from the DOM. Statements following `launchCore` will not execute.

If the promise rejects, the return type will also include:

```js
{
  type: 'request'|'js',     // Either 'request' on network error, or 'js' on exception
  src: <url>,               // If type: 'request', the URL that failed to load
  err: <Error>,             // If type: 'js', the exception object thrown
}
```
