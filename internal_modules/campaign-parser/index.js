'use strict';

var assert = require('assert');

module.exports = function (yeoman) {
  var fs = yeoman.file,
      cs = {
        elements: {},
        scripts: []
      },
      emptyVars = true,
      emptyScripts = true;

  /**
   * [description]
   * @param  {string} root path to the root campaign folder
   *
   * @return {object} campaign parser
   */
  return function (root) {
    var isDirExist = function () {
      return [fs.exists(root), fs.isDir(root)].every(function (el) {
        return el;
      });
    },

    addVariant = function (abspath, subdir, filename, content) {
      (cs.elements[subdir] || (cs.elements[subdir] = [])).push({
        name: filename,
        content: content
      });
    },

    addScript = function (filename) {
      cs.scripts.push(filename);
    },

    isEmpty = function (thing, content) {
      if (thing === 'variant') {
        return !/.+/im.test(content);
      } else {
        return \/\*\*\/im.test(content);
      }
    },

    setNotEmpty = function (thing) {
      if (thing === 'variant') {
        emptyVars = false;
      } else {
        emptyScripts = false;
      }
    },

    iterate = function () {
      var content;

      fs.recurse(root, function (abspath, rootdir, subdir, filename) {
        if (subdir) {
          content = fs.read(abspath);
          addVariant(abspath, subdir, filename, content);
          !isEmpty('variant', content) && setNotEmpty('variant');
        } else {
          addScript(filename);
          !isEmpty('script', content) && setNotEmpty('script');
        }
      });
    },
  }
};
