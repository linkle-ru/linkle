

const gulp = require('gulp')
const nodemon = require('gulp-nodemon')

gulp.task('develop', ['nodemon'], () => {})

gulp.task('nodemon', function (cb) {
  let started = false

  return nodemon({
    watch: [
      'source/server.js',
      'source/app.js',
      'source/mongo/models/*',
      'source/i18n/**/*',
      'source/api/*',
    ],
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
