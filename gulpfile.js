'use strict'

const gulp = require('gulp')
const browserSync = require('browser-sync').create()
const nodemon = require('gulp-nodemon')

// todo: продумать получше
const port = process.env.PORT || 8080

gulp.task('develop', ['serve'], function () {
  return gulp.watch(['source/gui/*'])
    .on('change', browserSync.reload)
})

gulp.task('default', ['browser-sync'], function () {
})

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync.init({
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
