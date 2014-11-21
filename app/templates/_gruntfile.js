module.exports = function (grunt) {

  // Utils
  var cmpgn = grunt.file.readJSON('campaign.json'),
      srcDir = 'src/',
      pubDir  = 'public',

      getVarPaths = function () {
        var els = Object.keys(cmpgn.elements);

        return els.map(function (e) {
          return els[e].map(function (v) {
            return (srcDir + e + '/' + v.replace(/\.html/, ''));
          });
        });
      },

      getPreprocPaths = function (src_ext, dest_ext) {
        var dirs  = getVarPaths(),
            tmp   = '/tmp/';

        return dirs.map(function (dir) {
          var name  = dir.replace(/.*\//, ''),
              src   = dir + '/' + name + '.' + src_ext,
              dest  = dir + tmp + name + '.' + dest_ext;

          return {
            src: src,
            dest: dest
          };
        });
      },

      getPathsForWrap = function (ext) {
        var dirs  = getVarPaths(),
            tmp   = '/tmp/';

        return dirs.map(function (dir) {
          var name  = dir.replace(/.*\//, ''),
              src   = dir + tmp + name + '.' + ext,
              dest  = src;

          return {
            src: src,
            dest: dest
          };
        });
      },

      getPathsForConcat = function () {
        var dirs  = getVarPaths(),
            tmp   = '/tmp/';

        return dirs.map(function (dir) {
          var name  = dir.replace(/.*\//, ''),
              base  = dir + tmp + name,
              css   = base + '.css',
              html  = base + '.html',
              js    = base + '.js',
              src   = [css, html, js],
              dest  = pubDir + dir.match(/\/.+?\//)[0] + name + '.html';

          return {
            src: src,
            dest: dest
          };
        });
      },

      getPathsForClean = function () {
        var dirs  = getVarPaths(),
            tmp   = '/tmp/';

        return dirs.map(function (dir) {
          return (dir + tmp);
        });
      };
