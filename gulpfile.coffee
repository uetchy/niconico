gulp       = require 'gulp'
plumber    = require 'gulp-plumber'
coffee     = require 'gulp-coffee'
uglify     = require 'gulp-uglify'
sourcemaps = require 'gulp-sourcemaps'
shell      = require 'gulp-shell'
# mocha      = require 'gulp-mocha'

gulp.task 'build', ->
  gulp.src 'src/**.coffee'
    .pipe sourcemaps.init()
    .pipe coffee bare: true
    # .pipe uglify()
    .pipe sourcemaps.write('.')
    .pipe gulp.dest 'lib'

gulp.task 'test', ['build'], ->
  gulp.src 'test/**.coffee', read: false
    .pipe shell [
      'npm test'
    ]
    # .pipe mocha
    #   reporter: 'nyan',
    #   compilers: 'coffee:coffee-script/register'

gulp.task 'watch', ['build'], ->
  gulp.watch ['{src,test}/**/*.coffee'], ['test']
