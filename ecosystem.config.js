module.exports = {
  apps: [{
    name: 'URL-ShortenerAPI',
    script: './source/server.js',
    env_production: {
      watch: false,
      NODE_ENV: 'production',
      API_PORT: 8080
    }
  }],
  deploy: {
    production: {
      'user': 'adminus',
      'host': '138.68.183.160',
      'ref': 'origin/master',
      'repo': 'git@github.com:taxnuke/url-shortener.git',
      'path': '/var/www/short.taxnuke.ru',
      'post-deploy':
        'npm i && npm run build && pm2 startOrReload ecosystem.config.js ' +
        '--update-env --env production'
    }
  }
}
