module.exports = function(config) {
  config.set({
    files: [
      'source/api/**/*',
      'source/gui/index.html',
      'source/lib/*',
      'source/i18n/**/*',
      'source/models/*',
      'source/app.js',
      'test/*.test.js',
      'package.json'
    ],
    mutate: [
      'source/api/**/*.js',
      'source/models/*.js',
      'source/app.js',
      'source/lib/reporters.js',
      'source/lib/validators.js',
      'source/i18n/error-codes.js',
    ],
    testRunner: 'mocha',
    mochaOptions: {
      timeout: 5000
    },
    testFramework: 'mocha',
    mutator: 'javascript',
    reporters: ['html', 'clear-text', 'progress', 'dashboard'],
    coverageAnalysis: 'perTest'
  })
}
