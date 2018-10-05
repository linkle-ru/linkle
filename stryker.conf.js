'use strict'

module.exports = function(config) {
  config.set({
    files: [
      'source/api/**/*',
      'source/gui/**/*',
      'source/helpers/*',
      'source/i18n/**/*',
      'source/mongo/models/*',
      'source/app.js',
      'test/*.test.js'
    ],
    mutate: [
      'source/api/*.js',
      'source/mongo/models/*.js',
      'source/app.js',
      'source/helpers/alias.js',
    ],
    testRunner: 'mocha',
    testFramework: 'mocha',
    mutator: 'javascript',
    reporters: ['html', 'clear-text', 'progress'],
    coverageAnalysis: 'perTest',
    maxConcurrentTestRunners: 4
  })
}
