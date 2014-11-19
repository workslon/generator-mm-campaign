'use strict';
var util    = require('util'),
    path    = require('path'),
    yeoman  = require('yeoman-generator'),
    yosay   = require('yosay'),
    fs      = require('fs');

var MmCampaignGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  writing: {
    app: function () {
      this.src.copy('_tmp_gruntfile.coffee', 'Gruntfile.coffee');
      this.src.copy('_main_gruntfile.coffee', '_Gruntfile.coffee');
      this.src.copy('_package.json', 'package.json');
    },

    projectfiles: function () {
      this.src.copy('editorconfig', '.editorconfig');
      this.src.copy('jshintrc', '.jshintrc');
    }
  },

  end: function () {
    this.installDependencies({
      callback: (function () {
        this.spawnCommand('grunt').on('close', (function () {
          fs.unlinkSync('Gruntfile.coffee');
          fs.renameSync('_Gruntfile.coffee', 'Gruntfile.coffee');
          this.spawnCommand('grunt');
        }).bind(this));
      }).bind(this)
    });
  }
});

module.exports = MmCampaignGenerator;
