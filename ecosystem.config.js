module.exports = {
  apps: [{
    name: 'URL-ShortenerAPI',
    script: './source/server.js',
    watch: [
      './source/api/*',
      './source/lib/*',
      './source/mongo/models/*',
      './source/app.js',
      './source/server.js'
    ],
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'url-short:*'
    }
  }]
}
