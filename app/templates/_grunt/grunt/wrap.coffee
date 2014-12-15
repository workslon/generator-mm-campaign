module.exports = (grunt) ->
  css:
    files: (require 'paths')(grunt).wrapCSS
    options:
      wrapper: ['<style>', '</style>\n']
  js:
    files: (require 'paths')(grunt).wrapJS
    options:
      wrapper: ['\n<script>', '</script>']
