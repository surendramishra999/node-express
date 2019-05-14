module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: 'airbnb-base',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'linebreak-style': 0,
    'global-require': 0,
    'comma-dangle': 0,
    'arrow-parens': [2, 'as-needed'],
    'eslint linebreak-style': [0, 'error', 'windows'],
  },
};
