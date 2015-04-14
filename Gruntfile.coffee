# Gruntfile for compiling assets (sass|coffee)
#
# Run:
#   grunt
#   grunt sass
#   grunt coffee

module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    watch:
      css:
        files: ['src/snappy-diagram.sass']
        tasks: ['sass']
      coffee:
        files: ['src/snap-multitext.coffee', 'src/snappy-cell.coffee', 'src/snappy-connector.coffee', 'src/snappy-diagram.coffee']
        tasks: ['coffee:compile']
    coffee:
      compile:
        options:
          join: true
        files:
          'dist/snappy-diagram.js': ['src/snap-multitext.coffee', 'src/snappy-cell.coffee', 'src/snappy-connector.coffee', 'src/snappy-diagram.coffee']
    sass:
      dist:
        options:
          style: 'expanded'
        files:
          'dist/snappy-diagram.css': 'src/snappy-diagram.sass'

  # Load the Grunt plugins.
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-contrib-coffee'

  # Register the default tasks.
  grunt.registerTask 'default', ['watch']
