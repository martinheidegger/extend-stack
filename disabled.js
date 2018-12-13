'use strict'
function extendStack (err) {
  if (typeof err !== 'object') {
    err = new Error(String(err))
  }
  if (!err.stack) {
    err.stack = 'Error: ' + JSON.stringify(err)
  }
  return err
}

exports.extendStack = extendStack
exports.extendCb = function extendCb (cb) {
  if (cb === null || cb === undefined) {
    return cb
  }
  return function (err, data) {
    if (err) {
      cb(extendStack(err), data)
    } else {
      cb(null, data)
    }
  }
}
