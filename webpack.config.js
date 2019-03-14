const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const pkg = require('./package.json');

// basic settings.

/**
 * if our entry point is a scss file, put to next array corresponding js file
 * to prevent creating dummy js file for each scss entry point.
 * @type Array
 */
const ignoredEmitFiles = ['app.js', 'sitebranding.js'];

/**
 * next object should contains entry points represents by key which is name of our entry point
 * and value which is path. Do not forget to resolve the path
 * @type Object
 */
const entry = {
  app: path.resolve(__dirname, './src/app.scss'),
  sitebranding: path.resolve(
    __dirname,
    './src/components/sitebranding/sitebranding.scss',
  ),
  fullpage: path.resolve(__dirname, './src/components/fullpage/fullpage.js'),
};

/**
 * next array defines list of the used plugins.
 * @type Array
 */
const plugins = [
  new MiniCssExtractPlugin({
    filename: '[name]/[name].css',
  }),
  new CleanWebpackPlugin(path.resolve(__dirname, 'build'), {}),
  new StyleLintPlugin({
    configFile: path.resolve(__dirname, '.stylelintrc'),
    context: path.resolve(__dirname, './src/'),
    files: '**/*.scss',
    failOnError: false,
    quiet: false,
  }),
  new IgnoreEmitPlugin(ignoredEmitFiles),
];

// if we have explore script running push to the list of plugins BundleAnalyzerPlugin
if (process.env.IS_EXPLORE) {
  // fill free to check for available options https://github.com/webpack-contrib/webpack-bundle-analyzer
  plugins.push(new BundleAnalyzerPlugin({}));
}

// export webpack config.
module.exports = {
  entry,
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: `${pkg.basePath}${pkg.name}/build/`,
    chunkFilename: '[name].js',
    filename: '[name]/[name].js',
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
          minSize: 0,
        },
        externals: {
          test: /[\\/]src[\\/]externals[\\/]/,
          minSize: 0,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 0,
        },
      },
    },
  },
};
