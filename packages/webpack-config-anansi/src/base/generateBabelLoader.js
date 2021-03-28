import path from 'path';
import semver from 'semver';
import * as babel from '@babel/core';
import { version as babelCoreVersion } from '@babel/core/package.json';
import { version as babelLoaderVersion } from 'babel-loader/package.json';

import { version } from '../../package.json';

export function generateBabelLoader({
  rootPath,
  babelRoot,
  target,
  mode,
  babelLoaderOptions,
}) {
  const react = require(require.resolve('react', {
    paths: [rootPath],
  }));
  let hasReactRefresh;
  try {
    require('react-refresh/babel');
    hasReactRefresh = true;
  } catch (e) {
    hasReactRefresh = false;
  }
  const hasJsxRuntime = react ? semver.gte(react.version, '16.14.0') : false;
  const cwd = path.resolve(process.cwd(), babelRoot);
  const filename = path.join(cwd, 'noop.js');
  const babelLoader = {
    loader: require.resolve('babel-loader'),
    options: {
      cwd,
      cacheDirectory: true,
      cacheIdentifier:
        JSON.stringify({
          version,
          target,
          mode,
          hasReactRefresh,
          hasJsxRuntime,
          babelCoreVersion,
          babelLoaderVersion,
        }) +
        JSON.stringify(
          babel.loadPartialConfig({
            filename,
            cwd,
            sourceFileName: filename,
          }).options,
        ),
      cacheCompression: mode === 'production',
      compact: mode === 'production',
      ...babelLoaderOptions,
    },
  };
  if (react) {
    babelLoader.options.caller = {
      hasJsxRuntime,
      ...babelLoader.options.caller,
    };
  }
  return babelLoader;
}
