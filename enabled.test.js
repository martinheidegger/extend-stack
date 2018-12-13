'use strict'
const test = require('tape')
const extendStack = require('./enabled.js').extendStack

test('[enabled]', t => {
  t.test('extendStack', t => {
    t.test('Adding extra stack error', t => {
      function x () {
        throw new Error('hello')
      }
      function y () {
        try {
          x()
        } catch (err) {
          throw extendStack(err)
        }
      }
      try {
        y()
      } catch (err) {
        let stack = err.stack
        stack = stack.split(__dirname).join('')
        const lines = stack.split('\n')
        t.equals(lines.shift(), 'Error: hello')
        let lineNo = 1
        let currentPart = []
        const stackParts = [currentPart]
        lines.forEach(function (line) {
          if (line === '    caused by:') {
            currentPart = []
            stackParts.push(currentPart)
            return
          }
          const parts = /^\s{4}at (.*) \(([^:]*):(\d+):(\d+)\)$/.exec(line)
          if (!parts) {
            t.fail(`Unparsable line: #${lineNo}: ${line}`)
            return
          }
          lineNo += 1
          const entry = {
            method: parts[1],
            file: parts[2],
            line: parseInt(parts[3], 10),
            row: parseInt(parts[4], 10)
          }
          if (/^\/node_modules\//.test(entry.file)) {
            return
          }
          currentPart.push(entry)
        })
        t.deepEqual(stackParts[0].slice(0, 1), [
          { method: 'y', file: '/enabled.test.js', line: 15, row: 17 }
        ])
        t.deepEqual(stackParts[1].slice(0, 2), [
          { method: 'x', file: '/enabled.test.js', line: 9, row: 15 },
          { method: 'y', file: '/enabled.test.js', line: 13, row: 11 }
        ])
        t.end()
      }
    })
    t.test('Extending an error without stack lines should just add the lines', t => {
      let err = new Error('abcd')
      // This happens with system errors
      err.stack = err.message
      err = extendStack(err)
      const lines = err.stack.split('\n')
      t.ok(lines.length > 3)
      t.notOk(/caused by:/.test(err.stack))
      t.end()
    })
  })
})
