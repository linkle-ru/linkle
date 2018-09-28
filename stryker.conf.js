module.exports = function(config) {
  config.set({
    files: [
      'source/api/**/*.js',
      { pattern: 'source/gui/**/*', included: false },
      'source/helpers/*.js',
      'source/i18n/**/*.json',
      'source/mongo/models/*.js',
      'source/app.js',
      'test/*.js',
    ],
    mutate: [
      'source/api/*.js',
      'source/mongo/models/*.js',
      'source/app.js',
    ],
    testRunner: 'mocha',
    testFramework: 'mocha',
    reporter: ['html', 'clear-text', 'progress'],
    coverageAnalysis: 'perTest',
    maxConcurrentTestRunners: 4
  })
}
