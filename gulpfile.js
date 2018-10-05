'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')
const webpack = require('webpack-stream')

// todo: продумать получше
const port = process.env.PORT || 8080
const NODE_ENV = process.env.NODE_ENV || 'development'

gulp.task('develop', ['browser-sync'], function () {
  gulp.watch([
    'source/gui/public/index.html',
    'source/gui/public/dist/app.js'
  ]).on('change', browserSync.reload)

  return gulp.src('src/entry.js')
    .pipe(webpack({
      mode: NODE_ENV,
      watch: true,
      devtool: 'source-map',
      entry: './source/gui/scripts/main.js',
      output: {
        filename: 'app.js'
      },
      stats: {
        colors: true
      },
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          }
        ]
      }
    }))
    .pipe(gulp.dest('./source/gui/public/dist'))
})

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
    port: 2999,
    proxy: {
      target: `http://localhost:${port}`,
      middleware: [
        function (req, res, next) {
          if (req.url.endsWith('/js/analytics.js')) {
            return res.end('console.warn("Яндекс.Метрика отключена")')
          }

          next()
        }
      ]
    },
    open: true,
    injectChanges: false
  })
})

gulp.task('nodemon', function (cb) {
  let started = false

  return nodemon({
    watch: ['source/server.js'],
    script: 'source/server.js'
  })
    .on('start', () => {
      // to avoid nodemon being started multiple times
      // thanks @matthisk
      if (!started) {
        cb()
        started = true
      }
    })
})
