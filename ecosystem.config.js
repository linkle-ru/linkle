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
      NODE_ENV: 'development',
      DEBUG: 'url-short:*'
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: 'url-short:*'
    }
  }],
  deploy: {
    production: {
      user: 'adminus',
      host: '138.68.183.160',
      ref: 'origin/master',
      repo: 'git@github.com:taxnuke/url-shortener.git',
      path: '/var/www/s.taxnuke.ru',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
