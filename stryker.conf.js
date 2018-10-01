module.exports = function(config) {
  config.set({
    files: [
      'source/api/**/*.js',
      'source/gui/**/*',
      'source/helpers/*.js',
      'source/i18n/**/*.json',
      'source/mongo/models/*.js',
      'source/app.js',
      'test/*.js'
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
