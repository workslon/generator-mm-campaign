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

  getStylePaths = (src_ext, dest_ext) ->
    dirs  = getVarPaths()

    paths = for dir in dirs
      name  = dir.replace(/.*\//, '')
      src   = path.join(dir, (name + src_ext), 'main' + src_ext)
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

  jade      = getPreprocPaths('.jade','.html')
  less      = getStylePaths('.less','.css')
  coffee    = getPreprocPaths('.coffee','.js')
  js        = getPreprocPaths('.js','.js')
  css       = getStylePaths('.css','.css')
  html      = getPreprocPaths('.html','.html')
  wrapCSS   = getPathsForWrap('.css')
  wrapJS    = getPathsForWrap('.js')
  concat    = getPathsForConcat()

  return {jade, less, coffee, js, css, html, wrapCSS, wrapJS, concat}
