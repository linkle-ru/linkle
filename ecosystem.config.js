module.exports = {
  apps: [{
    name: 'URL-ShortenerAPI',
    script: './source/server.js',
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
    // todo: добавить env для разработческой деятельности
    production: {
      'user': 'adminus',
      'host': '138.68.183.160',
      'ref': 'origin/master',
      'repo': 'git@github.com:taxnuke/url-shortener.git',
      'path': '/var/www/short.taxnuke.ru',
      'post-deploy':
        'npm i && npm run build && pm2 start ecosystem.config.js --env production'
    }
  }
}
