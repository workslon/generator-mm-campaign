module.exports = (grunt) ->
  css:
    files: (require 'paths')(grunt).wrapCSS
    options:
      wrapper: ['<style>', '</style>']
      indent: '\t'
  js:
    files: (require 'paths')(grunt).wrapJS
    options:
      wrapper: ['<script>', '</script>']
