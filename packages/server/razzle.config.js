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

    // appConfig.resolve.alias = {
    //   ...appConfig.resolve.alias,
    //   react: path.resolve('../../node_modules/react'),
    //   ['react-dom']: path.resolve('../../node_modules/react-dom'),
    // };

    // console.log('resolved path:', path.resolve('../../node_modules/react-dom'));
    if (target === 'node' && dev) {
      appConfig.externals = ['react', 'react-dom'];
    }

    // let webpack bundle the backend codes too
    // this prevents absolute filepaths of the build system's filesystem
    // to be included in the backend bundle (server.js)
    if (target === 'node' && !dev) {
      appConfig.externals = [];
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
