module.exports =
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
    src: ['src/*.js', 'public/*/*/*.js']
