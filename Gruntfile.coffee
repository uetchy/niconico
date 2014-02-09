module.exports = (grunt) ->
  'use strict'

  # Initialize config
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # Coffee Lint
    coffeelint:
      app:
        files:
          src: [
            'Gruntfile.coffee'
            'src/**/*.coffee'
            'test/**/*.coffee'
          ]
        options:
          max_line_length:
            level: 'ignore'

    # Watching files
    watch:
      scripts:
        files: [
          'Gruntfile.coffee'
          'src/**/*.coffee'
          'test/**/*.coffee'
        ]
        tasks: [
          'coffeelint'
          'coffee'
          'simplemocha'
        ]
        options:
          interrupt: yes

    # Simple Mocha
    simplemocha:
      all:
        src: ['test/**/*.coffee']

    # Coffee コンパイル
    coffee:
      compile:
        files:
          'lib/nicovideo.js': 'src/nicovideo.coffee'
          'lib/index.js': 'src/index.coffee'
        options:
          bare: yes

  # Load tasks
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-simple-mocha'

  # Register tasks
  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'simplemocha'
  ]