module.exports = (grunt) ->
  'use strict'

  # Initialize config
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

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
        src: ['test/**/*.js']

  # Load tasks
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-simple-mocha'

  # Register tasks
  grunt.registerTask 'default', [
    'simplemocha'
  ]
