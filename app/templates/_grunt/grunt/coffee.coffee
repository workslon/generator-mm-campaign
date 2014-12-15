module.exports = (grunt) ->
  variants:
    files: require('paths')(grunt).coffee
    options:
      bare: true
  scripts:
    expand: true
    cwd: '<%= srcDir %>/'
    src: ['*.coffee']
    dest: '<%= pubDir %>'
    ext: '.js'

