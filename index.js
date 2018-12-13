'use strict'
const isEnabled = require('debug').enabled('extend-stack')
const extendStack = isEnabled ? require('./enabled.js') : require('./disabled.js')

module.exports = extendStack
