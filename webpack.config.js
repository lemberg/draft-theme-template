// npm imports
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const path = require('path');

// custom imports
const CollectIgnoredWebpackHelper = require('./webpack-custom-helpers/collect-ignored-webpack-helper');
const WildcardsEntryWebpackPlugin = require('./webpack-custom-helpers/wildcards-entry-webpack-plugin');

const getVendorName = require('./webpack-custom-helpers/vendor-name-generate-helper');
const pkg = require('./package.json');

/**
 * We set next `vendorChunkNameLengthRestriction` to control
 * in a smart way a vendor file name.
 * This mean — if we have vendor only for one component we could include it
 * to the cooresponding library
 * For example, we have a particular smart component which uses lodash
 * and anyone else componen didn't have that dependency. So we could make
 * `Drupal library`, which contains with component itself + it's vendor
 * Does it make sense?
 * @type number
 */
const vendorChunkNameLengthRestriction = 2;

/**
 * Next object contains default entry points represents by key which is the name
 * of our entry point and the value which is path. Do not forget to resolve the path
 * if you are going to add some more entries as a defaults (path.resolve).
 * @type Object
 */
const defaultEntries = { app: path.resolve(__dirname, './src/app.scss') };

/**
 * grab entries via wild card and `WildcardsEntryWebpackPlugin`
 */
const entry = WildcardsEntryWebpackPlugin.entry(
  './src/components/**/*.+(scss|js)',
  defaultEntries,
);

/**
 * If our entry point is a scss file, put to next array corresponding js file
 * to prevent creating dummy js file for each scss entry point.
 * You have to do this only for default entry points from defined erlier
 * `defaultEntries` Object
 * @type Array
 */
const ignoredFiles = ['app.js'];

const ignoredEmitFiles = CollectIgnoredWebpackHelper.ignored(
  './src/components/**/*.+(js|scss)',
  './src/components/**/_*.scss',
  ignoredFiles,
  '.scss',
);

/**
 * Next array defines list of the used plugins.
 * @type Array
 */
const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
  new CleanWebpackPlugin(path.resolve(__dirname, 'build'), {}),
  new StyleLintPlugin({
    configFile: path.resolve(__dirname, '.stylelintrc'),
    context: path.resolve(__dirname, './src/'),
    files: '**/*.scss',
    failOnError: false,
    quiet: false,
  }),
  new WildcardsEntryWebpackPlugin(),
];

/**
 * set default stats
 * @type Object
 */
let stats = {
  children: false,
  builtAt: true,
  assets: false,
  hash: false,
  colors: true,
  env: true,
  modules: false,
  entrypoints: false,
};

/**
 * If we have `explore` script running push to the list of plugins `BundleAnalyzerPlugin`
 */

if (process.env.IS_EXPLORE) {
  // fill free to check for available options https://github.com/webpack-contrib/webpack-bundle-analyzer
  plugins.push(new BundleAnalyzerPlugin({}));
  // reset stats to see everything
  stats = {};
}

/**
 * if we have `build` script running push to the list of plugins `IgnoreEmitPlugin`
 * with array of ignored files
 */
if (process.env.NODE_ENV === 'production') {
  plugins.push(new IgnoreEmitPlugin(ignoredEmitFiles));
}

module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: `${pkg.basePath}${pkg.name}/build/`,
    chunkFilename: '[name].js',
    filename: '[name].js',
  },
  stats,
  performance: {
    hints: 'warning',
  },
  devtool: false,
  externals: {
    jquery: 'jQuery',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loaders: 'file-loader?name=assets/images/[name].[ext]',
      },
    ],
  },
  plugins,
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        shared: {
          test: /[\\/]src[\\/]shared[\\/]/,
          name(module, chunks, cacheGroupKey) {
            // generate a chunk name...
            return getVendorName(
              chunks,
              cacheGroupKey,
              vendorChunkNameLengthRestriction,
            );
          },
          minSize: 0,
        },
        externals: {
          test: /[\\/]src[\\/]externals[\\/]/,
          name(module, chunks, cacheGroupKey) {
            // generate a chunk name...
            return getVendorName(
              chunks,
              cacheGroupKey,
              vendorChunkNameLengthRestriction,
            );
          },
          minSize: 0,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name(module, chunks, cacheGroupKey) {
            // generate a chunk name...
            return getVendorName(
              chunks,
              cacheGroupKey,
              vendorChunkNameLengthRestriction,
            );
          },
          minSize: 0,
        },
      },
    },
  },
};
