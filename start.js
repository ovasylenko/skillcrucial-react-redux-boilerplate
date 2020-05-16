// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')()

module.exports = require('./server/server.js')
