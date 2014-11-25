'use strict';

module.exports = function (yeoman) {
  var file = yeoman.file,
      tree = {
        elements: {},
        scripts: []
      },
      hasEmptyVars = true,
      hasEmptyScripts = true;

  /**
   * parse campaign and return tree object
   * @param  {string} root path to the root campaign folder
   * @return {object} campaign tree
   */
  return function (root) {
    var isDirExist = function () {
      return [file.exists(root), file.isDir(root)].every(function (el) {
        return el;
      });
    },

    addVariant = function (abspath, subdir, filename, content) {
      (tree.elements[subdir] || (tree.elements[subdir] = [])).push({
        name: filename,
        content: content
      });
    },

    addScript = function (filename) {
      tree.scripts.push(filename);
    },

    isEmpty = function (thing, content) {
      if (thing === 'variant') {
        return !/.+/im.test(content);
      } else {
        return /\/\*\*\//im.test(content);
      }
    },

    setNotEmpty = function (thing) {
      if (thing === 'variant') {
        hasEmptyVars = false;
      } else {
        hasEmptyScripts = false;
      }
    },

    parse = (function () {
      var content;

      file.recurse(root, function (abspath, rootdir, subdir, filename) {
        if (subdir) {
          content = file.read(abspath);
          addVariant(abspath, subdir, filename, content);
          if (!isEmpty('variant', content)) {
            setNotEmpty('variant');
          }
        } else {
          addScript(filename);
          if (!isEmpty('script', content)) {
            setNotEmpty('script');
          }
        }
      });
    })();

    return {
      tree: tree,
      hasEmptyVars: hasEmptyVars,
      hasEmptyScripts: hasEmptyScripts
    };
  };
};
