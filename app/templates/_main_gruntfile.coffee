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

  varPaths          = getVarPaths()
  preprocPathsJade  = getPreprocPaths('jade', 'html')
  preprocPathsLess  = getPreprocPaths('less', 'css')
  preprocPathsJS    = getPreprocPaths('js', 'js')
  pathsForWrapCSS   = getPathsForWrap('css')
  pathsForWrapJS    = getPathsForWrap('js')
  pathsForConcat    = getPathsForConcat()
  pathsForClean     = getPathsForClean()

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
        globals: {
          window: false
          jQuery: false
          $: false
          console: false
          mmcore: true
          mm_inner_HTML: true
        }
      all:
        src: 'src/**/*.js'

    # grunt jade
    jade:
      all:
        files: preprocPathsJade

    # grunt less
    less:
      all:
        files: preprocPathsLess

    # grunt copy
    copy:
      variants:
        files: preprocPathsJS
      scripts:
        expand: true
        cwd: 'src/'
        src: ['*.js']
        dest: '<%= pubDir %>'

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

    clean: pathsForClean

    imagemin:
      all:
        files: [
          expand: true,
          cwd: 'src/img/',
          src: ['**/*.{png,jpg,gif}'],
          dest: '<%= pubDir %>/img/'
        ]

    # grunt remove logging
    removelogging:
      dist:
        src: ['<%= pubDir %>/**/*.*']

    # grunt watch
    watch:
      jade:
        files: '**/*.jade'
        tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
      less:
        files: '**/*.less'
        tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
      js:
        files: '<%= srcDir %>/**/*.js'
        tasks: ['jade', 'less', 'copy', 'wrap', 'concat', 'clean']
      img:
        files: 'src/img/*.{png,jpg,gif}'
        tasks: ['imagemin']

    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-jade'
    grunt.loadNpmTasks 'grunt-contrib-less'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-imagemin'
    grunt.loadNpmTasks 'grunt-remove-logging'
    grunt.loadNpmTasks 'grunt-wrap'

    grunt.registerTask('default', ['jshint', 'jade', 'less', 'copy', 'wrap', 'concat', 'clean', 'imagemin', 'watch']);

    grunt.registerTask('golive', ['jshint', 'jade', 'less', 'copy', 'wrap', 'concat', 'clean', 'removelogging']);
