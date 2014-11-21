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

  prompting: function () {
    var done = this.async();

    this.log(yosay(
      'Welcome to the Maxymiser campaign generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'campaignName',
      message: 'Please provide campaign name:',
      default: 'camapign'
    }, {
      type: 'confirm',
      name: 'isJade',
      message: 'Would you like to use jade instead of html in variants?',
      default: false
    }, {
      type: 'list',
      name: 'styletool',
      message: 'What stylesheet language would you prefer to use?',
      choices: ['CSS', 'Less', 'Saas'],
      default: 0
    }, {
      type: 'confirm',
      name: 'coffeeInVars',
      message: 'Would you like to use coffeescript in variants?',
      default: false
    }, {
      type: 'confirm',
      name: 'coffeeInScripts',
      message: 'Would you like to use coffeescript for campaign scripts?',
      default: false
    }, {
      type: 'checkbox',
      name: 'scripts',
      message: 'Please choose scripts you will need for your campaign?',
      choices: ['render', 'checker', 'actions', 'micro templater', 'utils']
    }];

    this.prompt(prompts, function (props) {
      this.campaign = {
        name: props.campaignName,
        isJade: props.isJade,
        styletool: props.styletool,
        coffeeInVars: props.coffeeInVars,
        coffeeInScripts: props.coffeeInScripts,
        this.scripts: props.scripts
      }

      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.src.copy('_tmp_gruntfile.coffee', 'Gruntfile.coffee');
      this.src.copy('_gruntfile.js', '_Gruntfile.js');
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
          yeoman.file.delete('Gruntfile.coffee');
          fs.renameSync('_Gruntfile.js', 'Gruntfile.js');

          editor.insertConfig('compass', '{ foo: bar }');
          console.log(editor.toString());

          // buildGruntFile();
          this.spawnCommand('grunt');
        }).bind(this));
      }).bind(this)
    });
  }
});

module.exports = MmCampaignGenerator;
