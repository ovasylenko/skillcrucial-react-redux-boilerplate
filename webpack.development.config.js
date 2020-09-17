const { resolve } = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { v4: uuidv4 } = require('uuid')
const eslintCacheIdentifier = JSON.stringify(fs.statSync('.eslintrc').mtimeMs)
require('dotenv').config()

const version = 'development'
const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: ['./main.js'],
  resolve: {
    alias: {
      d3: 'd3/index.js',
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    filename: 'js/[name].bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  mode: 'development',
  context: resolve(__dirname, 'client'),
  devServer: {
    hot: false,
    contentBase: resolve(__dirname, 'dist/assets'),
    watchContentBase: true,
    host: 'localhost',
    port: 8087,
    disableHostCheck: true,
    open: true,
    historyApiFallback: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: [
      {
        context: ['/api', '/auth', '/ws'],
        target: `http://localhost:${process.env.PORT || 8090}`,
        secure: false,
        changeOrigin: true,
        ws: (process.env.ENABLE_SOCKETS || false)
      }
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        include: [/client/, /server/],
        loader: [
          {
            loader: 'eslint-loader',
            options: {
              cache: false,

              cacheIdentifer: eslintCacheIdentifier
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [/client/, /stories/],
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
              publicPath: '../',
              hmr: process.env.NODE_ENV === 'development'
            }
          },

          { loader: 'css-loader', options: { sourceMap: true } },
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: `${__dirname}/client/assets/images`, to: 'images' },
          { from: `${__dirname}/client/assets/fonts`, to: 'fonts' },

          { from: `${__dirname}/client/assets/sitemap.xml`, to: 'sitemap.xml' },
          { from: `${__dirname}/client/assets/manifest.json`, to: 'manifest.json' },
          { from: `${__dirname}/client/index.html`, to: 'index.html' },

          {
            from: `${__dirname}/client/install-sw.js`,
            to: 'js/install-sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, version)
            }
          },
          { from: `${__dirname}/client/assets/robots.txt`, to: 'robots.txt' },
          {
            from: `${__dirname}/client/html.js`,
            to: 'html.js',
            transform: (content) => {
              return content.toString().replace(/COMMITHASH/g, version)
            }
          },
          {
            from: `${__dirname}/client/sw.js`,
            to: 'sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, version)
            }
          }
        ]
      },
      { parallel: 100 }
    ),

    new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin(
      Object.keys(process.env).reduce(
        (res, key) => ({ ...res, [key]: JSON.stringify(process.env[key]) }),
        {
          APP_VERSION: uuidv4().substr(0, 7),
          ENABLE_SOCKETS: JSON.stringify(process.env.ENABLE_SOCKETS || false)
        }
      )
    ),
    //  new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config
