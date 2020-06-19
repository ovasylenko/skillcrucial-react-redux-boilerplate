const { resolve } = require('path')
require('dotenv').config()
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const { v4: uuidv4 } = require('uuid')

const gitRevisionPlugin = new GitRevisionPlugin()
const APP_VERSION = uuidv4().substr(0, 7)

const config = {
  // optimization: {
  //   minimize: true,
  //   minimizer: [
  //     new TerserJSPlugin({ parallel: true }),
  //     new OptimizeCSSAssetsPlugin({
  //       cssProcessor: require('cssnano'),
  //       cssProcessorPluginOptions: {
  //         preset: ['default', { discardComments: { removeAll: true } }]
  //       }
  //     })
  //   ]
  // },
  // node: {
  //   fs: 'empty'
  // },
  target: 'node',

  entry: {
    root: './config/root.js'
  },
  resolve: {
    alias: {
      d3: 'd3/index.js'
    }
  },
  output: {
    filename: 'js/ssr/[name].bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/ssr/root.[name].bundle.js?id=[chunkhash]'
  },
  mode: 'production',
  context: resolve(__dirname, 'client'),
  devtool: false,
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        test: /.html$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /COMMITHASH/gi,
              replacement() {
                return gitRevisionPlugin.commithash()
              }
            }
          ]
        })
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: [
          {
            loader: 'eslint-loader',
            options: {
              cache: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },
          { loader: 'css-loader', options: { sourceMap: false } },
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
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          { loader: 'css-loader', options: { sourceMap: false } },
          {
            loader: 'postcss-loader'
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
        test: /\.(jpg|png|gif|svg|webp)$/,
        loader: 'image-webpack-loader',
        enforce: 'pre'
      },
      {
        test: /\.(jpg|png|gif|webp)$/,
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
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
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
    new webpack.DefinePlugin({
      NODE_ENV: 'production',
      LANDING_URL: process.env.LANDING_URL,
      IS_PROD: process.env.NODE_ENV === 'production',
      APP_VERSION: JSON.stringify(APP_VERSION),
      STRIPE_PUBLIC_KEY: JSON.stringify({ key: process.env.STRIPE_PUBLIC_KEY }),
      SENTRY_CLIENT_URL: JSON.stringify({ key: process.env.SENTRY_CLIENT_URL })
    })
  ]
}

module.exports = config
