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
      'source/api/**/*.js',
      'source/models/*.js',
      'source/app.js',
      'source/lib/alias.js',
      'source/lib/constants.js',
    ],
    testRunner: 'mocha',
    mochaOptions: {
      timeout: 5000
    },
    testFramework: 'mocha',
    mutator: 'javascript',
    reporters: ['html', 'clear-text', 'progress', 'dashboard'],
    coverageAnalysis: 'perTest',
    maxConcurrentTestRunners: 4
  })
}
