 module.exports = (grunt) ->
  # campaign json structure
  cmpgn   = grunt.file.readJSON 'campaign.json'

  # src path
  srcDir  = 'src/'
  pubDir  = 'public'

  getVarPaths = ->
    els   = cmpgn.elements
    paths = for el, vars of els
      for v in vars
        (srcDir + el + '/' + v.replace(/\.html/, ''))

    paths.join(',').split(',')

  getPreprocPaths = (src_ext, dest_ext) ->
    dirs  = getVarPaths()
    tmp   = '/tmp/'

    paths = for dir in dirs
      name  = dir.replace(/.*\//, '')
      src   = dir + '/' + name + '.' + src_ext
      dest  = dir + tmp + name + '.' + dest_ext

      src: src
      dest: dest

    paths

  getPathsForWrap = (ext) ->
    dirs  = getVarPaths()
    tmp   = '/tmp/'

    paths = for dir in dirs
      name  = dir.replace(/.*\//, '')
      src   = dir + tmp + name + '.' + ext
      dest  = src

      src: src
      dest: dest

    paths

  getPathsForConcat = ->
    dirs  = getVarPaths()
    tmp   = '/tmp/'

    paths = for dir in dirs
      name  = dir.replace(/.*\//, '')
      base  = dir + tmp + name
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
    tmp   = '/tmp/'

    paths = for dir in dirs
      (dir + tmp)

    paths

  varPaths = getVarPaths()
  # preprocPathsJade  = getPreprocPaths('jade', 'html')
  # preprocPathsLess  = getPreprocPaths('less', 'css')
  # preprocPathsJS    = getPreprocPaths('js', 'js')
  # pathsForWrapCSS   = getPathsForWrap('css')
  # pathsForWrapJS    = getPathsForWrap('js')
  # pathsForConcat    = getPathsForConcat()
  # pathsForClean     = getPathsForClean()

  # # load grunt tasks
  # require('load-grunt-tasks')(grunt);

  # # grunt config
  # grunt.initConfig
  #   srcDir: './src'
  #   pubDir: './public'

  #   # grunt jshint
  #   jshint:
  #     options:
  #       curly: true
  #       eqeqeq: true
  #       immed: true
  #       latedef: true
  #       newcap: true
  #       noarg: true
  #       sub: true
  #       undef: true
  #       boss: true
  #       eqnull: true
  #       browser: true
  #       globals: {
  #         window: false
  #         jQuery: false
  #         $: false
  #         console: false
  #         mmcore: true
  #         mm_inner_HTML: true
  #       }
  #     all:
  #       src: 'src/**/*.js'

  #   # grunt jade
  #   jade:
  #     all:
  #       files: preprocPathsJade

  #   # grunt less
  #   less:
  #     all:
  #       files: preprocPathsLess

  #   # grunt coffee
  #   coffee:
  #     scripts:
  #       expand: true
  #       cwd: 'src/'
  #       src: ['*.coffee']
  #       dest: '<%= pubDir %>'
  #       ext: '.js'
  #       options:
  #         bare: true

  #   # grunt copy
  #   copy:
  #     variants:
  #       files: preprocPathsJS
  #     scripts:
  #       expand: true
  #       cwd: '<%= srcDir %>'
  #       src: ['*.js']
  #       dest: '<%= pubDir %>'

  #   # grunt wrap
  #   wrap:
  #     css:
  #       files: pathsForWrapCSS
  #       options:
  #         wrapper: ['<style>', '</style>\n']
  #     js:
  #       files: pathsForWrapJS
  #       options:
  #         wrapper: ['\n<script>', '</script>']

  #   # grunt concat
  #   concat:
  #     all:
  #       files: pathsForConcat

  #   clean:
  #     tmp:
  #       src: pathsForClean
  #     img:
  #       src: ['<%= srcDir %>/img/*.*']

  #   imagemin:
  #     all:
  #       files: [
  #         expand: true,
  #         cwd: 'src/img/',
  #         src: ['**/*.{png,jpg,gif}'],
  #         dest: '<%= pubDir %>/img/'
  #       ]

  #   # grunt remove logging
  #   removelogging:
  #     dist:
  #       src: ['<%= pubDir %>/**/*.*']

  #   # grunt watch
  #   watch:
  #     jade:
  #       files: '**/*.jade'
  #       tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
  #     less:
  #       files: '**/*.less'
  #       tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
  #     coffee:
  #       files: '<%= srcDir %>/*.coffee'
  #       tasks: ['newer:coffee:scripts']
  #     js:
  #       files: '<%= srcDir %>/**/*.js'
  #       tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
  #     img:
  #       files: 'src/img/*.{png,jpg,gif}'
  #       tasks: ['newer:imagemin:all']

  #   grunt.registerTask('default', ['jshint', 'jade', 'less', 'coffee', 'copy', 'wrap', 'concat', 'imagemin', 'clean', 'watch']);

  #   grunt.registerTask('golive', ['jshint', 'jade', 'less', 'coffee', 'copy', 'wrap', 'concat', 'imagemin', 'clean', 'removelogging']);
