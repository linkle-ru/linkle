module.exports = {
  apps: [{
    name: 'URL-ShortenerAPI',
    script: './source/server.js',
    watch: [
      './source/api/v1/*',
      './source/lib/*',
      './source/models/*',
      './source/app.js',
      './source/server.js'
    ],
    env: {
      'NODE_ENV': 'development',
      'DEBUG': 'url-short:*'
    }
  }]
}
