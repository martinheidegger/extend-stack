'use strict'
const test = require('tape')

/**
 * This tests behavior both in enabled and disabled state
 */
;[
  { name: 'enabled', impl: require('./enabled.js') },
  { name: 'disabled', impl: require('./disabled.js') }
].forEach(parts => {
  const name = parts.name
  const extendCb = parts.impl.extendCb
  const extendStack = parts.impl.extendStack

  test(`[${name}] extendStack`, t => {
    t.test('extending an error should return the error', t => {
      const err = new Error()
      t.equals(extendStack(err), err)
      t.end()
    })
    t.test('extending a string should return an error', t => {
      const err = extendStack('hello')
      t.ok(err instanceof Error)
      t.equals(err.message, 'hello')
      t.end()
    })

    t.test('Extending an object without message should add a standard message', t => {
      const err = extendStack({ hello: 'world' })
      t.notEquals(err.stack, undefined)
      t.equals(err.stack.split('\n')[0], 'Error: ' + JSON.stringify({ hello: 'world' }))
      t.end()
    })
  })

  test(`[${name}] extendCb`, t => {
    t.test('empty callback returns empty', t => {
      t.equals(extendCb(null), null)
      t.equals(extendCb(undefined), undefined)
      t.end()
    })
    t.test('callback with error', t => {
      const throwError = new Error('hello')
      extendCb((err, data) => {
        t.equals(err, throwError)
        t.equals(data, undefined)
        t.end()
      })(throwError)
    })
    t.test('callback with error and data', t => {
      const throwError = new Error('hello')
      extendCb((err, data) => {
        t.equals(err, throwError)
        t.equals(data, 'world')
        t.end()
      })(throwError, 'world')
    })
    t.test('callback with string error', t => {
      const throwError = 'hello'
      extendCb((err, data) => {
        t.ok(err instanceof Error)
        t.equals(err.message, throwError)
        t.equals(data, undefined)
        t.end()
      })(throwError)
    })
    t.test('called synchronously', t => {
      let state = 'start'
      const cb = extendCb(() => {
        state = 'called'
      })
      cb()
      t.equals(state, 'called')
      t.end()
    })
    t.test('called with error undefined should pass null', t => [
      extendCb((err) => {
        t.equals(err, null)
        t.end()
      })()
    ])
  })
})
