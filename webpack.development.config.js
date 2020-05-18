const { resolve } = require('path')
require('dotenv').config()

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { v4: uuidv4 } = require('uuid')
const version = 'development'
const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://0.0.0.0:8087',
    'webpack/hot/only-dev-server',
    './main.js'
  ],
  resolve: {
    alias: {
      d3: 'd3/index.js',
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash].js'
  },
  mode: 'development',
  context: resolve(__dirname, 'client'),
  devServer: {
    hot: true,
    contentBase: resolve(__dirname, 'dist/assets'),
    watchContentBase: true,
    host: '0.0.0.0',
    port: 8087,

    historyApiFallback: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: [
      {
        context: ['/api', '/auth', '/ws'],
        target: 'http://0.0.0.0:8090',
        secure: false,
        changeOrigin: true,
        ws: true
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
              cache: true
            }
          }
        ]
      },
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [/client/],
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
    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false
        }
      }
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[id].css',
      ignoreOrder: false
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: 'assets/images', to: 'images' },
          { from: 'assets/fonts', to: 'fonts' },

          { from: 'assets/sitemap.xml', to: 'sitemap.xml' },
          { from: 'assets/manifest.json', to: 'manifest.json' },
          { from: 'index.html', to: 'index.html' },

          {
            from: 'install-sw.js',
            to: 'js/install-sw.js',
            transform: (content) => {
              return content.toString().replace(/APP_VERSION/g, version)
            }
          },
          { from: 'assets/robots.txt', to: 'robots.txt' },
          { from: 'vendors', to: 'vendors' },
          {
            from: 'html.js',
            to: 'html.js',
            transform: (content) => {
              return content.toString().replace(/COMMITHASH/g, version)
            }
          },
          {
            from: 'sw.js',
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
    new webpack.DefinePlugin({
      NODE_ENV: 'development',
      LANDING_URL: process.env.LANDING_URL,
      IS_PROD: process.env.NODE_ENV === 'production',
      APP_VERSION: uuidv4().substr(0, 7),
      STRIPE_PUBLIC_KEY: JSON.stringify({ key: process.env.STRIPE_PUBLIC_KEY })
    }),
    new HardSourceWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}

module.exports = config
