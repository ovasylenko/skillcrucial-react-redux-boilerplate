const { resolve } = require('path');
require('dotenv').config()

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin();
const StringReplacePlugin = require("string-replace-webpack-plugin");
const uuidv4 = require('uuid/v4')

const config = {
  entry: [
    './main.js',    
    './assets/scss/main.scss'
  ],
  resolve: {
      alias: {
        'd3': 'd3/index.js'
      }
  },
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, 'dist/assets'),
    publicPath: '',
  },
  mode: 'production',
  context: resolve(__dirname, 'client'),
  devtool: false,
  performance: {
      hints: false,
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
                    pattern: /COMMITHASH/ig,
                    replacement: function (match, p1, offset, string) {
                        return gitRevisionPlugin.commithash();
                    }
                }
            ]
        })
    },      
    { 
      test: /\.js$/,
      loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /COMMITHASH/ig,
              replacement: function (match, p1, offset, string) {
                  return gitRevisionPlugin.commithash();
              }
            }
          ]
      })
  },      
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      },
      {
        test: /\.js$/,
        loaders: [
          'babel-loader',
        ],
        exclude: /node_modules/,
      },      
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [ 'css-loader' ],
          publicPath: '../_build'
        }),
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'sass-loader',
              query: {
                sourceMap: false,
              },
            },
          ],
          publicPath: '../'
        }),
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 100,
              mimetype: 'image/png',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            }
          }
        ],
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
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/font-woff',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'application/octet-stream',
              name: 'fonts/[name].[ext]',
            }
          }
        ],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              mimetype: 'image/svg+xml',
              name: 'images/[name].[ext]',
            }
          }
        ],
      },
    ]
  },

  plugins: [
    new StringReplacePlugin(),

    new webpack.LoaderOptionsPlugin({
      test: /\.js$/,
      options: {
        eslint: {
          configFile: resolve(__dirname, '.eslintrc'),
          cache: false,
        }
      },
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),    
    new ExtractTextPlugin({ filename: 'css/main.css', disable: false, allChunks: true }),
    new CopyWebpackPlugin([{ from: 'assets/images', to: 'images' }]),
    new CopyWebpackPlugin([{ from: 'assets/fonts', to: 'fonts' }]),

    new CopyWebpackPlugin([{ from: 'vendors', to: 'vendors' }]),
    new CopyWebpackPlugin([{ from: 'assets/manifest.json', to: 'manifest.json' }]),
    new CopyWebpackPlugin([{ from: 'html.js', to: 'html.js', transform: (content) => {
      return content.toString().replace(/COMMITHASH/g, uuidv4());
    }
    }]),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    })
  ],
};

module.exports = config;
