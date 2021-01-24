// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
const path = require('path');

module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    const { output, ...restConfig } = config;
    const { file, ...restOutput } = output;
    // Remove file ref and insert dir to support (multiple bundle exports).
    // This enables dynamic import, React.lazy(), etc.
    return {
      ...restConfig,
      output: {
        ...restOutput,
        dir: path.join(__dirname, 'dist'),
      },
    }; // always return a config.
  },
};
