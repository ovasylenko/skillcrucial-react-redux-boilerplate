const { resolve } = require('path')
require('dotenv').config()

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const nodeExternals = require('webpack-node-externals')

const gitRevisionPlugin = new GitRevisionPlugin()
const date = +new Date()

console.log(date - (date % (1000 * 60 * 30)))
const APP_VERSION = Buffer.from((date - (date % (1000 * 60 * 30))).toString())
  .toString('base64')
  .replace(/==/, '')

const config = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({ parallel: true }),
      new OptimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }]
        }
      })
    ]
  },
  target: 'node',
  mode: 'development',
  entry: {
    root: './config/root.js'
  },
  externals: [nodeExternals()],
  resolve: {

    alias: {
      d3: 'd3/index.js',
      './setPrototypeOf': './setPrototypeOf.js',
      './defineProperty': './defineProperty.js',
      '../../helpers/esm/typeof': '../../helpers/esm/typeof.js',
      './assertThisInitialized': './assertThisInitialized.js'
    }
  },
  output: {
    filename: 'js/ssr/[name].bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/ssr/[name].js?id=[chunkhash]',
    libraryTarget: 'commonjs'
  },
  mode: 'production',
  context: resolve(__dirname, 'client'),
  devtool: false,
  performance: {
    hints: 'warning',
    maxEntrypointSize: 1512000,
    maxAssetSize: 1512000
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [/client/, /server/],
        use: ['eslint-loader']
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader'
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
              publicPath: '../'
            }
          },

          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'postcss-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      {
        test: /\.(png|jpg|gif|webp)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.woff(2)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          },
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10 * 1024,
              noquotes: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new StringReplacePlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/ssr/[name].css',
      chunkFilename: 'css/ssr/[id].css',
      ignoreOrder: false
    }),
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce(
        (res, key) => ({ ...res, [key]: JSON.stringify(process.env[key]) }),
        {
          APP_VERSION: JSON.stringify(APP_VERSION)
        }
      )
    )
  ]
}

module.exports = config
