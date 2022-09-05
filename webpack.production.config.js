const { resolve } = require('path')
require('dotenv').config()
const fs = require('fs')

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const StringReplacePlugin = require('string-replace-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const date = +new Date()
const APP_VERSION = Buffer.from((date - (date % (1000 * 60 * 30))).toString())
  .toString('base64')
  .replace(/==/, '')

const config = {
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin({ parallel: true })]
  },
  entry: {
    main: './main.jsx'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],

    alias: {
      d3: 'd3/index.js'
    }
  },
  output: {
    filename: 'js/[name].bundle.js?v=COMMITHASH1',
    path: resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: 'js/[name].js?id=[chunkhash]'
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
        test: /\.js|jsx$/,
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
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: 'node_modules'
    }),
    new StringReplacePlugin(),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'assets/images', to: 'images' },
          { from: 'assets/fonts', to: 'fonts' },
          { from: 'assets/manifest.json', to: 'manifest.json' },
          {
            from: 'install-sw.js',
            to: 'js/install-sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, APP_VERSION)
            }
          },
          { from: 'vendors', to: 'vendors' },
          {
            from: 'html.js',
            to: 'html.js',
            transform: (content) => {
              return content.toString().replace(/COMMITHASH/g, APP_VERSION)
            }
          },
          {
            from: 'sw.js',
            to: 'sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, APP_VERSION)
            }
          }
        ]
      },
      { parallel: 100 }
    ), // `...`,
    new CssMinimizerPlugin({ parallel: 4 }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ template: 'index.html' }),
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
