module.exports = (grunt) ->
  html:
    files: (require 'paths')(grunt).html
  css:
    files: (require 'paths')(grunt).css
  jsvars:
    files: (require 'paths')(grunt).js
  jsscripts:
    expand: true
    cwd: 'src/'
    src: ['*.js']
    dest: 'public/'
    ext: '.js'
