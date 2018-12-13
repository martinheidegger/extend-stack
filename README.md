# extend-stack

`extend-stack` offers two util methods `extendStack` and `extendCb` that make it easier
to track async errors in callback systems.

[![Build Status](https://travis-ci.org/martinheidegger/extend-stack.svg?branch=master)](https://travis-ci.org/martinheidegger/extend-stack)

## Installation and Setup

```shell
$ npm install extend-stack
```

`extend-stack` is **disabled by default** because it consumes quite a bit of resources to work.
To enable it you need enable [debug][debug-wiki] either when calling your code…

```shell
$ env DEBUG=extend-stack node myapp.js # mac variant!
```

…or programmatically − after adding `$ npm install debug` − like this…

```javascript
const debug = require('debug')
debug.enable('extend-stack')
```

[debug-wiki]: https://github.com/visionmedia/debug#windows-command-prompt-notes

## Usage

The two methods are exposed as object:

```javascript
const { extendStack, extendCb } = require('extend-stack')
```

### `extendCb(function (err, data) {})` → `function (err, data) {}`

`extendCb` adds the error stack of the calling function in case an error
occurs.

```javascript
const fs = require('fs')

setImmediate(() => {
  fs.readFile('non-existing', extendCb((err) => {
    console.log(err.stack)
  }))
})
```

<div><em>(disabled)</em></div>

```
Error: ENOENT: no such file or directory, open 'non-existing'
```

<div><em>(enabled)</em></div>

```
Error: ENOENT: no such file or directory, open 'non-existing'
    at Immediate.setImmediate (/extend-stack/examples/extendCb.js:5:31)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
```

If the error contains a stack, the stack will be part of it:

```javascript
const { extendCb } = require('..')

function errorProne (cb) {
  setImmediate(() => cb(new Error('sample-error')))
}

function userFunction () {
  errorProne(
    extendCb(err => console.log(err.stack))
  )
}

setImmediate(userFunction)
```

<div><em>(disabled)</em></div>

```
Error: sample-error
    at Immediate.setImmediate [as _onImmediate] (/extend-stack/examples/extendCb-withStack.js:4:25)
    at runCallback (timers.js:705:18)
    at tryOnImmediate (timers.js:676:5)
    at processImmediate (timers.js:658:5)
```

<div><em>(enabled)</em></div>

```
Error: sample-error
    at Immediate.userFunction (/extend-stack/examples/extendCb-withStack.js:9:5)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
    caused by:
    at Immediate.setImmediate (/extend-stack/examples/extendCb-withStack.js:4:25)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
```

### `extendStack(err, [offset])` → `Error`

`extendStack` extends the stack stored in `err` and adds the current line's stack as well.

```javascript
const { extendStack } = require('..')

function subsystem (err) {
  return extendStack(err)
}

setImmediate(() => {
  const err = subsystem(new Error('some-error'))
  console.log(err)
})
```

<div><em>(disabled)</em></div>

```
Error: some-error
    at Immediate.setImmediate (/extend-stack/examples/extendStack.js:8:25)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
```

<div><em>(enabled)</em></div>

```
Error: some-error
    at subsystem (/extend-stack/examples/extendStack.js:4:10)
    at Immediate.setImmediate (/extend-stack/examples/extendStack.js:8:15)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
    caused by:
    at Immediate.setImmediate (/extend-stack/examples/extendStack.js:8:25)
    at runCallback (timers.js:789:20)
    at tryOnImmediate (timers.js:751:5)
    at processImmediate [as _immediateCallback] (timers.js:722:5)
```

## License

[MIT](./LICENSE)
