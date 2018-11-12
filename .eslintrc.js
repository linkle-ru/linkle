module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2015
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true
  },
  extends: [
    'plugin:vue/recommended'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': 'next|undefined'
      }
    ],
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ],
    'no-console': [
      'warn'
    ],
    'arrow-parens': [
      'error',
      'as-needed'
    ],
    'max-len': [
      'warn',
      {
        'code': 80,
        'comments': 65,
        'ignoreUrls': true
      }
    ],
    'max-lines': [
      'error',
      200
    ],
    'max-lines-per-function': [
      'warn', {
        'max': 25,
        'skipComments': true
      }
    ],
    'strict': [
      'error',
      'global'
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 1,
        'maxBOF': 0,
        'maxEOF': 1
      }
    ]
  }
}
