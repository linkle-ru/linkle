module.exports = function(config) {
    config.set({
        files: [
            'src/api/**/*.js',
            'src/gui/*.js',
            { pattern: 'src/gui/views/*.pug', included: false },
            'src/helpers/*.js',
            'src/i18n/**/*.json',
            'src/mongo/models/*.js',
            'src/app.js',
            'src/credentials.json',
            'test/*.js',
        ],
        mutate: [
            'src/api/*.js',
            'src/gui/*.js',
            'src/mongo/models/*.js',
            'src/app.js',
        ],
        testRunner: 'mocha',
        testFramework: 'mocha',
        reporter: ['html', 'clear-text', 'progress'],
        coverageAnalysis: 'perTest',
        maxConcurrentTestRunners: 4
    });
};
