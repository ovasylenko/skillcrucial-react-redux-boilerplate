module.exports = {
  'presets': [
    ['@babel/env', {
      'targets': {
        'browsers': '> 0.25%, not dead'
      },
      'loose': true
    }],
    '@babel/react',
    '@babel/typescript'
  ],

  'plugins': [
    'emotion',
    'react-hot-loader/babel',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    [
      'css-modules-transform',
      {
        'extensions': ['.styl', '.css', '.scss']
      }
    ]
  ]
}
