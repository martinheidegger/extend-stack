exports.extendStack = function (err, offset) {
  return doExtend(err, offset, new Error().stack)
}

function doExtend (err, offset, passStack) {
  if (typeof err !== 'object') {
    err = new Error(String(err))
  }
  if (!offset) {
    offset = 0
  }
  var passLines = passStack.split('\n').slice(2 + offset)
  if (err.stack) {
    var lines = err.stack.split('\n')
    passLines.unshift(lines[0])
    if (lines.length > 1) {
      passLines.push('    caused by:')
      passLines = passLines.concat(lines.slice(1))
    }
  } else if (err.message) {
    passLines.unshift(err.message)
  } else {
    passLines.unshift('Error: ' + JSON.stringify(err))
  }
  err.stack = passLines.join('\n')
  return err
}

exports.extendCb = function (cb) {
  const stack = new Error().stack
  return function (err, data) {
    if (err === null || err === undefined) {
      cb(null, data)
      return
    }
    cb(doExtend(err, 0, stack), data)
  }
}
