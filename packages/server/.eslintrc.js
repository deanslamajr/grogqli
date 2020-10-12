module.exports = {
  extends: [
    'react-app',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: '999.999.999',
    },
  },
  // overrides: [
  //   {
  //     files: ['*.min.js'],
  //     rules: {
  //       'no-unused-expressions': 'off',
  //     },
  //   },
  // ],
};
