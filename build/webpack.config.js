const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const debug = require('debug')('app:webpack:config')

const paths = config.utils_paths
const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__
const __TEST__ = config.globals.__TEST__
const __SSR__ = config.globals.__SSR__

debug('Creating configuration.')
const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : config.compiler_devtool,
  resolve : {
    modules: [
      paths.client(),
      'node_modules'
    ],
    extensions : ['.js', '.jsx', '.json']
  },
  module : {}
}
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY_PATHS = [
  'whatwg-fetch',
  paths.client('main.js')
]

webpackConfig.entry = {
  app : __DEV__
    ? APP_ENTRY_PATHS.concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`)
    : APP_ENTRY_PATHS,
  vendor : config.compiler_vendors
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  chunkFilename   : `[id].[name].[${config.compiler_hash_type}].js`,
  filename   : `[name].[${config.compiler_hash_type}].js`,
  path       : __SSR__ ? paths.distSSR() : paths.dist(),
  publicPath : config.compiler_public_path,
  libraryTarget: 'var',
  library    : `[name]`
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template : paths.client('index.html'),
    hash     : false,
    favicon  : paths.client('static/favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      collapseWhitespace : true
    }
  })
]

if (__SSR__) {
  webpackConfig.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /(.*)(\/RouteAsync$)/, function (result) {
        result.request = result.request.replace(/(.*)(\/RouteAsync$)/, '$1/Route')
        return result
      })
  )
}

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        unused    : true,
        dead_code : true,
        warnings  : false
      }
    })
  )
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names : ['vendor']
    })
  )
}

webpackConfig.plugins.push(
  new webpack.LoaderOptionsPlugin({
    options: {
      context: paths.client(),
      postcss: [ // <---- postcss configs go here under LoadOptionsPlugin({ options: { ??? } })
        cssnano({
          autoprefixer : {
            add      : true,
            remove   : true,
            browsers : ['last 2 versions']
          },
          discardComments : {
            removeAll : true
          },
          discardUnused : false,
          mergeIdents   : false,
          reduceIdents  : false,
          safe          : true,
          sourcemap     : true
        })
      ],
      sassLoader: {
        includePaths : paths.client('styles')
      }
      // ...other configs that used to directly on `modules.exports`
    }
  })
)

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test    : /\.(js|jsx)$/,
  exclude : /node_modules/,
  loader  : 'babel',
  query   : config.compiler_babel
}, {
  test   : /\.json$/,
  loader : 'json'
}]

// ------------------------------------
// Style Loaders
// ------------------------------------
// We use cssnano with the postcss loader, so we tell
// css-loader not to duplicate minimization.
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.css$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
})

// File loaders
/* eslint-disable */
webpackConfig.module.loaders.push(
  { test: /\.woff(\?.*)?$/,  loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/,   loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/,   loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/,    loader: 'url?limit=8192' }
)
/* eslint-enable */

// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.')
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
    const first = loader.loaders[0]
    const rest = loader.loaders.slice(1)
    loader.loader = ExtractTextPlugin.extract({ fallbackLoader: first, loader: rest })
    delete loader.loaders
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks : true })
  )
}

module.exports = webpackConfig
