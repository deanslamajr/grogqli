const path = require('path');

// https://razzle-git-canary.jared.vercel.app/docs/customization#extending-webpack
// the sauce -> https://github.com/jaredpalmer/razzle/blob/e3cfbe568e4c8ae202603cb8a41ab19c2d65b963/packages/razzle/config/createConfig.js
module.exports = {
  // plugins: ['eslint'],
  modifyWebpackConfig({
    env: {
      target, // the target 'node' or 'web'
      dev, // is this a development build? true or false
    },
    webpackConfig, // the created webpack config
    webpackObject, // the imported webpack node module
    options: {
      razzleOptions, // the modified options passed to Razzle in the `options` key in `razzle.config.js` (options: { key: 'value'})
      webpackOptions, // the modified options that will be used to configure webpack/ webpack loaders and plugins
    },
    paths, // the modified paths that will be used by Razzle.
  }) {
    const appConfig = webpackConfig; // stay immutable here

    // this ensures that the SSR (e.g. renderToStringWithData) use the same react & react-dom instances as the frontend bundles
    // this avoids the "infamous" react hooks errors https://github.com/facebook/react/issues/15315
    if (target === 'node') {
      appConfig.externals = ['react', 'react-dom'];
    }

    // This conditional accomplishes 2 goals
    // 1. by replacing the default razzle value, we allow
    // webpack to include all backend dependencies in the bundle
    // (e.g. replaces require('someDependency') with the dependency's actual code)
    // this prevents absolute filepaths of the build system's filesystem
    // to be included in the backend bundle (server.js)
    // 2. the reference to consolidate fixes a bug during publish where
    // the consolidate package's behavior of dynamicly referencing other modules
    // depending on the particular use case breaks when trying to accomplish #1
    // https://github.com/tj/consolidate.js/issues/295#issuecomment-551097683
    if (target === 'node' && !dev) {
      appConfig.externals = {
        consolidate: 'commonjs consolidate',
      };
    }

    return appConfig;
  },
  options: {
    verbose: true,
    useReactRefresh: true,
  },
  // experimental: {
  //   newBabel: true,
  //   newExternals: true,
  //   newSplitChunks: true,
  //   newContentHash: true,
  //   newMainFields: true,
  // }
};
