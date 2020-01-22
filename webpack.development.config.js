const path = require('path')
require('dotenv').config()
const webpack = require('webpack')
const glob = require('glob')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
require('babel-polyfill')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, 'client')
}

const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:3001',
    'webpack/hot/only-dev-server',
    './main.js',
    './assets/scss/main.scss'
  ],
  resolve: {
    alias: {
      d3: 'd3/index.js'
    }
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist/assets'),
    publicPath: ''
  },
  mode: 'development',
  context: path.resolve(__dirname, 'client'),
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, 'dist/assets'),
    watchContentBase: true,
    host: 'localhost',
    port: 3001,

    historyApiFallback: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: [
      {
        context: ['/api', '/auth', '/ws', '/js/variables.js', '/sockjs-node'],
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'client'),
        loaders: ['thread-loader', 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'thread-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('autoprefixer')(),
                require('cssnano')()
              ]
            }
          }
        ]
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader'
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          {
            loader: 'css-loader',
            options: { sourceMap: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }),
                require('postcss-preset-env')(),
                require('autoprefixer')(),
                require('cssnano')()
              ]
            }
          },
          {
            loader: 'sass-loader',
            query: {
              sourceMap: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          configFile: path.resolve(__dirname, '.eslintrc'),
          cache: false
        }
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false
    }),
    new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    }),
    new CopyWebpackPlugin([{ from: 'assets/images', to: 'images' }]),
    new CopyWebpackPlugin([{ from: 'assets/fonts', to: 'fonts' }]),
    new CopyWebpackPlugin([{ from: 'index.html', to: 'index.html' }]),

    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new CopyWebpackPlugin([{ from: 'assets/manifest.json', to: 'manifest.json' }]),
    new CopyWebpackPlugin([{ from: 'assets/robots.txt', to: 'robots.txt' }]),

    new WebpackShellPlugin({ onBuildStart: ['npm run watch:server'] }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),

    new HardSourceWebpackPlugin(),

    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config
