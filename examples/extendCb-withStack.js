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
