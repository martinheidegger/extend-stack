const { extendCb } = require('..')
const fs = require('fs')

setImmediate(() => {
  fs.readFile('non-existing', extendCb((err) => {
    console.log(err.stack)
  }))
})
