gulp    = require 'gulp'
plumber = require 'gulp-plumber'
coffee  = require 'gulp-coffee'
uglify  = require 'gulp-uglify'

gulp.task 'build', ->
  gulp.src 'src/**/*.coffee'
    .pipe coffee bare: true
    .pipe uglify()
    .pipe gulp.dest './'

gulp.task 'watch', ['build'], ->
  gulp.watch 'src/**/*.coffee', ['build']
