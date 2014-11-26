'use strict';

module.exports = function (yeoman) {
    var path  = require('path'),
        fs    = yeoman.file;

    var name,       prefix,
        elements,   scripts,
        srcDir,     pubDir,
        elementDir, variantDir,
        element,    variant,
        extensions,

        normalizeExt = function (ext) {
          if (ext) {
            return '.' + ext.toLowerCase();
          }
        };

    return function (tree, config, dest) {

      console.log('name::', config.campaignName)

      name      = config.campaignName;
      prefix    = (name.match(/[A-Za-z]\d+\_?/) || [undefined, 'TXX'])[0];

      elements  = tree.elements,
      scripts   = tree.scripts,

      srcDir    = path.join(dest, 'src');
      pubDir    = path.join(dest, 'public');

      extensions  = {
        markup: normalizeExt(config.markup),
        style: normalizeExt(config.style),
        script: normalizeExt(config.scriptInVars),
        helper: normalizeExt(config.scriptInScripts),
      };

      // create `src` folder structure
      fs.mkdir(srcDir);

      // elements
      for (element in elements) {
        elementDir = path.join(srcDir, element);

        // create element folder
        fs.mkdir(elementDir);

        elements[element].forEach(function (el) {
          variantDir  = path.join(srcDir, element, path.basename(el.name, '.html'));
          variant     = path.join(variantDir, path.basename(el.name, '.html'));

          // create variant directory
          fs.mkdir(variantDir);

          // create variant
          [extensions.markup, extensions.style, extensions.script]
            .forEach(function (ext) {
              fs.write(variant + ext, el.content);
            });
        });
      }

      // existed scripts
      scripts.forEach(function (script) {
        script = path.join(srcDir, script.name);
        fs.write(script, script.content);
      });

      // helper scripts
      config.helpers.forEach(function (helper) {
        helper = prefix + helper;
        helper += extensions.helper;
        helper = path.join(srcDir, helper);

        if (!fs.exists(helper)) {
          fs.write(helper, helper.content);
        }
      });
    }
};
