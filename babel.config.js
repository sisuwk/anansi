const { resolvePath } = require('babel-plugin-module-resolver');

module.exports = function (api) {
  api.cache.using(() => process.env.NODE_ENV + process.env.BROWSERSLIST_ENV);
  return {
    presets: [
      [
        '@anansi',
        {
          typing: 'typescript',
          loose: true,
          modules: 'commonjs',
          resolver: {
            extensions: ['.ts.', '.tsx', '.js', '.jsx', '.es', '.es6', '.mjs'],
            resolvePath(sourcePath, currentFile, opts) {
              if (
                process.env.NODE_ENV === 'test' &&
                sourcePath.startsWith('.') &&
                sourcePath.endsWith('.js')
              ) {
                const removedExt = sourcePath.substr(0, sourcePath.length - 3);
                return resolvePath(removedExt, currentFile, opts);
              }
            },
            root: [],
          },
        },
      ],
    ],
    assumptions: {
      noDocumentAll: true,
      noClassCalls: true,
      constantReexports: true,
      objectRestNoSymbols: true,
      pureGetters: true,
    },
    // allows us to load .babelrc in addition to this
    babelrcRoots: ['packages/*', 'examples/*'],
  };
};
