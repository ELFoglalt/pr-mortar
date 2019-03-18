module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: 'airbnb-base',
  globals: {
    __static: true,
  },
  plugins: ['html', 'vue'],
  rules: {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    'no-trailing-spaces': [2, { skipBlankLines: true }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow electron imports
    'import/no-extraneous-dependencies': 0,
    // warnings over errors
    'no-useless-constructor': 1,
    'padded-blocks': 1,
    'no-multiple-empty-lines': 1,
    'no-unused-vars': 1,
  },
};
