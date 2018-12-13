const { extendStack } = require('..')

function subsystem (err) {
  return extendStack(err)
}

setImmediate(() => {
  const err = subsystem(new Error('some-error'))
  console.log(err)
})
