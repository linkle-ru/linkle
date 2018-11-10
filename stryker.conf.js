

module.exports = function(config) {
  config.set({
    files: [
      'source/api/**/*',
      'source/gui/index.html',
      'source/lib/*',
      'source/i18n/**/*',
      'source/models/*',
      'source/app.js',
      'test/*.test.js'
    ],
    mutate: [
      'source/api/*.js',
      'source/mongo/models/*.js',
      'source/app.js',
      'source/helpers/alias.js',
      'source/helpers/constants.js',
    ],
    testRunner: 'mocha',
    testFramework: 'mocha',
    mutator: 'javascript',
    reporters: ['html', 'clear-text', 'progress'],
    coverageAnalysis: 'perTest',
    maxConcurrentTestRunners: 4
  })
}
