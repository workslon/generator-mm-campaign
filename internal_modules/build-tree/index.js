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

      //--- create `src` folder structure
      fs.mkdir(srcDir);

      // create `img` folder
      fs.mkdir(path.join(srcDir, 'img'));

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

          // create variant's markup and scriptiong files
          [extensions.markup, extensions.script]
            .forEach(function (ext) {
              fs.write(variant + ext);
            });

          // create styles dir with manifest file
          fs.mkdir(variant + extensions.style);
          fs.write(path.join(variant + extensions.style, 'main' + extensions.style));
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

        if (!fs.exists(path.join(srcDir, helper))) {
          fs.write(helper, helper.content);
        }
      });

      //--- create `public` folder structure
      fs.mkdir(pubDir);

      // elements
      for (element in elements) {
        elementDir = path.join(pubDir, element);
        fs.mkdir(elementDir);

        // create variants
        elements[element].forEach(function (el) {
          variant = path.join(elementDir, el.name);
          fs.write(variant, el.content);
        });

        fs.delete(element);
      }

      // scripts
      scripts.forEach(function (script) {
        script = path.join(pubDir, script.name);
        fs.write(script, script.content);
      });

      scripts.forEach(function (script) {
        fs.delete(script.name);
      });
    }
};
