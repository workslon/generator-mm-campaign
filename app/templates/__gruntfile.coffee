module.exports = (grunt) ->
  path = require 'path'

  # campaign json structure
  cmpgn   = grunt.file.readJSON 'campaign.json'

  # src path
  srcDir  = 'src/'
  pubDir  = 'public/'
  tmp     = 'tmp/'

  getVarPaths = ->
    els   = cmpgn.elements
    paths = for el, vars of els
      for v in vars
        ext = path.extname(v.name)
        name = path.basename(v.name, ext)
        path.join(srcDir, el, name)

    paths.join(',').split(',')

  getPreprocPaths = (src_ext, dest_ext) ->
    dirs  = getVarPaths()

    paths = for dir in dirs
      name  = dir.replace(/.*\//, '')
      src   = path.join(dir, (name + src_ext))
      dest  = path.join(dir, tmp, (name + dest_ext))

      src: src
      dest: dest

    paths

  getPathsForWrap = (ext) ->
    dirs  = getVarPaths()

    paths = for dir in dirs
      name  = path.basename(dir) + ext
      src   = path.join(dir, tmp, name)
      dest  = path.join(src)

      src: src
      dest: dest

    paths

  getPathsForConcat = ->
    dirs  = getVarPaths()

    paths = for dir in dirs
      name  = path.basename(dir)
      base  = path.join(dir, tmp, name)
      css   = base + '.css'
      html  = base + '.html'
      js    = base + '.js'
      src   = [css, html, js]
      dest  = pubDir + dir.match(/\/.+?\//)[0] + name + '.html'

      src: src
      dest: dest

    paths

  getPathsForClean = ->
    dirs  = getVarPaths()

    paths = for dir in dirs
      path.join(dir, tmp)

    paths

  varPaths            = getVarPaths()
  preprocPathsJade    = getPreprocPaths('.jade','.html')
  preprocPathsLess    = getPreprocPaths('.less','.css')
  preprocPathsCoffee  = getPreprocPaths('.coffee','.js')
  preprocPathsJS      = getPreprocPaths('.js','.js')
  preprocPathsCSS     = getPreprocPaths('.css','.css')
  preprocPathsHTML    = getPreprocPaths('.html','.html')
  pathsForWrapCSS     = getPathsForWrap('.css')
  pathsForWrapJS      = getPathsForWrap('.js')
  pathsForConcat      = getPathsForConcat()
  pathsForClean       = getPathsForClean()

  # grunt load grunt tasks
  require('load-grunt-tasks')(grunt);

  # grunt config
  grunt.initConfig
    srcDir: './src'
    pubDir: './public'

    # grunt jshint
    jshint:
      options:
        curly: true
        eqeqeq: true
        immed: true
        latedef: true
        newcap: true
        noarg: true
        sub: true
        undef: true
        boss: true
        eqnull: true
        browser: true
        debug: true
        globals: {
          window: false
          jQuery: false
          console: false
          mmcore: true
          mm_inner_HTML: true
        }
      all:
        src: ['<%= srcDir %>/*.js', '<%= srcDir %>/*/*/*.js']

    # grunt clean
    clean:
      img:
        src: ['<%= srcDir %>/img/*.*']

    # grunt imagemin
    imagemin:
      all:
        files: [
          expand: true
          cwd: '<%= srcDir %>/img/'
          src: ['**/*.{png,jpg,gif}']
          dest: '<%= pubDir %>/img/'
        ]

    # grunt jade
    jade:
      all:
        files: preprocPathsJade

    # grunt less
    less:
      all:
        files: preprocPathsLess

    # grunt coffee
    coffee:
      variants:
        files: preprocPathsCoffee
        options:
          bare: true
      scripts:
        expand: true
        cwd: '<%= srcDir %>/'
        src: ['*.coffee']
        dest: '<%= pubDir %>'
        ext: '.js'

    # grunt copy
    copy:
      html:
        files: preprocPathsHTML
      css:
        files: preprocPathsCSS
      jsvars:
        files: preprocPathsJS
      jsscripts:
        expand: true
        cwd: '<%= srcDir %>/'
        src: ['*.js']
        dest: '<%= pubDir %>'
        ext: '.js'

    # grunt coffeelint
    coffeelint:
      all:
        files:
          src: [
            '<%= srcDir %>/*.coffee'
            '<%= srcDir %>/**/*.coffee'
          ]
        options:
          no_backticks:
            level: 'ignore'

    # grunt wrap
    wrap:
      css:
        files: pathsForWrapCSS
        options:
          wrapper: ['<style>', '</style>\n']
      js:
        files: pathsForWrapJS
        options:
          wrapper: ['\n<script>', '</script>']

    # grunt concat
    concat:
      all:
        files: pathsForConcat

    # grunt watch
    watch:
      img:
        files: '<%= srcDir %>/img/*.{png,jpg,gif}'
        tasks: ['newer:imagemin:all', 'clean']
      jade:
        files: '**/*.jade'
        tasks: ['newer:jade', 'newer:concat']
      less:
        files: '**/*.less'
        tasks: ['newer:less', 'newer:wrap:css', 'newer:concat']
      coffeeVars:
        files: '<%= srcDir %>/**/*.coffee'
        tasks: [
          'newer:coffee:variants'
          'newer:coffeelint'
          'newer:wrap:js'
          'newer:concat'
        ]
      coffeeScripts:
        files: '<%= srcDir %>/*.coffee'
        tasks: ['newer:coffee:scripts', 'newer:coffeelint']
      copyJsScripts:
        files: '<%= srcDir %>/*.js'
        tasks: 'newer:copy:jsscripts'
      copyJsVars:
        files: '<%= srcDir %>/*/*/*.js'
        tasks: [
          'newer:copy:jsvars'
          'newer:jshint'
          'newer:wrap:js'
          'newer:concat'
        ]
      copyHtml:
        files: '<%= srcDir %>/*/*/*.html'
        tasks: [
          'newer:copy:html'
          'newer:concat'
        ]
      copyCss:
        files: '<%= srcDir %>/*/*/*.css'
        tasks: [
          'newer:copy:css'
          'newer:wrap:css'
          'newer:concat'
        ]

    # register default task
    grunt.registerTask 'default', [
      'copy'
      'jade'
      'less'
      'coffee'
      'wrap'
      'concat'
      'imagemin'
      'clean'
      'watch'
    ]
