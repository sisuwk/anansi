import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import WebpackStrip from 'webpack-strip';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import FixStyleOnlyEntriesPlugin from 'webpack-fix-style-only-entries';

import { getStyleRules, ROOT_PATH } from './base';


export default function makeProdConfig(baseConfig, { basePath, libraryExclude, buildDir }) {
  const config = { ...baseConfig };

  config.mode = 'production';
  config.bail = true; // this helps automatic build tools not waste time
  config.output.pathinfo = false;
  config.plugins.push(
    new webpack.IgnorePlugin(/DevTools/),
    new CleanWebpackPlugin([buildDir], {
      root: ROOT_PATH,
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[name].[contenthash].css',
    }),
  );
  config.optimization = {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|schedule|object-assign|loose-envify)[\\/]/,
          name: 'react',
          chunks: 'all',
        },
        styles: {
          test: /style\/.*\.scss$/,
          name: 'style',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    // https://webpack.js.org/configuration/optimization/#optimization-runtimechunk
    runtimeChunk: {
      name: 'runtime',
    },
  };
  config.optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        mangle: {
          keep_fnames: true,
        },
        ie8: false,
      },
      sourceMap: true,
      extractComments: true,
      parallel: true,
    }),
    new OptimizeCSSAssetsPlugin({}),
  ];
  config.module.rules.push({
    test: /\.jsx?$/,
    use: WebpackStrip.loader('debug', 'logger', 'console.log', 'console.warn', 'console.error'),
    exclude: libraryExclude,
  });

  const styleRules = getStyleRules({
    basePath,
  }).map(rule => ({
    ...rule,
    use: [MiniCssExtractPlugin.loader, ...rule.use.slice(1)],
  }));
  config.module.rules = [...config.module.rules, ...styleRules];

  return config;
}
