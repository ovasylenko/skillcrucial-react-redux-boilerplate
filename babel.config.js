module.exports = {
  presets: [
    [
      '@babel/env',
      {
        targets: {
          browsers: '> 0.25%, not dead'
        },
        loose: true
      }
    ],
    '@babel/react',
    '@babel/typescript'
  ],

  plugins: (process.env.NODE_ENV === 'development'
    ? ['react-hot-loader/babel', 'react-refresh/babel']
    : []
  ).concat([
    '@emotion',
    '@babel/plugin-syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'css-modules-transform',
      {
        extensions: ['.styl', '.css', '.scss']
      }
    ]
  ])
}
