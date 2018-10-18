// https://eslint.org/docs/user-guide/configuring

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
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential'
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
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
    'strict': [
      'error',
      'global'
    ]
  }
}
