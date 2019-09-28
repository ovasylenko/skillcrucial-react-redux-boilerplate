// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('@babel/register')({
  'presets': [
    ['@babel/env', {
      'targets': {
        'browsers': ['last 2 versions']
      }
    }],
    '@babel/react',
    '@babel/typescript'
  ],

  'plugins': [
    'react-hot-loader/babel',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-proposal-decorators', { 'legacy': true }]
  ]
})

module.exports = require('./server/server.js')
