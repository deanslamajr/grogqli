module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.graphqls$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-tag/loader' }],
    });

    config.module.rules.push({
      test: /\.ya?ml$/,
      type: 'json',
      use: 'yaml-loader',
    });

    return config;
  },
};
