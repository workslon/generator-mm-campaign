module.exports =
  img:
    files: 'src/img/*.{png,jpg,gif}'
    tasks: ['newer:imagemin:all', 'clean']
  jade:
    files: '**/*.jade'
    tasks: ['newer:jade', 'newer:concat']
  less:
    files: '**/*.less'
    tasks: ['newer:less', 'newer:wrap:css', 'newer:concat']
  coffeeVars:
    files: 'src/**/*.coffee'
    tasks: [
      'newer:coffee:variants'
      'newer:coffeelint'
      'newer:wrap:js'
      'newer:concat'
    ]
  coffeeScripts:
    files: 'src/*.coffee'
    tasks: ['newer:coffee:scripts', 'newer:coffeelint']
  copyJsScripts:
    files: 'src/*.js'
    tasks: 'newer:copy:jsscripts'
  copyJsVars:
    files: 'src/*/*/*.js'
    tasks: [
      'newer:copy:jsvars'
      'newer:jshint'
      'newer:wrap:js'
      'newer:concat'
    ]
  copyHtml:
    files: 'src/*/*/*.html'
    tasks: [
      'newer:copy:html'
      'newer:concat'
    ]
  copyCss:
    files: 'src/*/*/*/*.css'
    tasks: [
      'newer:copy:css'
      'newer:wrap:css'
      'newer:concat'
    ]
