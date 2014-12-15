'use strict';
var ncp     = require('ncp').ncp,
    util    = require('util'),
    path    = require('path'),
    yeoman  = require('yeoman-generator'),
    yosay   = require('yosay'),
    parse   = require('../internal_modules/parse-tree/')(yeoman),
    build   = require('../internal_modules/build-tree/')(yeoman);

var MmCampaignGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    // this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async(),

        prompts = {
          campaignName: {
            type: 'input',
            name: 'campaignName',
            message: 'Please provide campaign name:',
            default: 'camapign'
          },

          markup: {
            type: 'list',
            name: 'markup',
            message: 'Which markup language would you like to use?',
            choices: ['html', 'jade'],
            default: 0
          },

          style: {
            type: 'list',
            name: 'style',
            message: 'Which stylesheet language would you prefer to use?',
            choices: ['css', 'less'],
            default: 0
          },

          scriptInVars: {
            type: 'list',
            name: 'scriptInVars',
            message: 'Which scripting language would you like to use in variants?',
            choices: ['js', 'coffee'],
            default: 0
          },

          scriptInScripts: {
            type: 'list',
            name: 'scriptInScripts',
            message: 'Which scripting language would you like to use for campaign scripts?',
            choices: ['js', 'coffee'],
            default: 0
          },

          helpers: {
            type: 'checkbox',
            name: 'helpers',
            message: 'Please select the scripts you will need for your campaign',
            choices: ['Render', 'Checker', 'Actions', 'Templater', 'Utils']
          }
        },

        promptSequence = [
          'campaignName',
          'markup',
          'style',
          'scriptInVars',
          'scriptInScripts',
          'helpers'
        ],

        userPrompts = [],

        removePrompt = function (promptName) {
          promptSequence.splice(promptSequence.indexOf(promptName), 1);
        },

        configUserPrompts = function (campaign) {
          if (!campaign.hasEmptyVars) {
            removePrompt('markup');
            removePrompt('style');
            removePrompt('scriptInVars');
          }

          if (!campaign.hasEmptyScripts) {
            removePrompt('scriptInScripts');
          }

          promptSequence.forEach(function (el) {
            userPrompts.push(prompts[el]);
          });
        },

        getUserConfig = function (props) {
          var config = {
            campaignName: 'campaign',
            markup: 'html',
            style: 'css',
            scriptInVars: 'js',
            scriptInScripts: 'js',
            helpers: []
          },
          prop;

          for (prop in props) {
            config[prop] = props[prop];
          }

          return config;
        };

    this.campaign = parse(this.destinationRoot());
    configUserPrompts(this.campaign);

    this.log(yosay(
      'Welcome to the Maxymiser campaign generator!'
    ));

    this.prompt(userPrompts, function (props) {
      this.userConfig = getUserConfig(props);
      done();
    }.bind(this), {store: true});
  },

  writing: {
    app: function () {
      // create campaign structure
      build(this.campaign.tree, this.userConfig, this.destinationRoot());

      // load and config package.json
      this.defPkgPath   = this.templatePath('_package.json');
      this.pkgPath      = this.destinationPath('package.json');
      this.pkg          = this.fs.readJSON(this.defPkgPath);
      this.pkg.name     = this.userConfig.campaignName;
      this.pkg          = JSON.stringify(this.pkg);
      this.fs.write(this.pkgPath, this.pkg);

      // add some configuration files
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );

      // add campaign.json
      this.fs.write(
        this.destinationPath('campaign.json'),
        JSON.stringify(this.campaign.tree)
      );

      // add Gruntfile
      this.gruntfilePath = this.destinationPath('Gruntfile.coffee');
      this.fs.copy(
        this.templatePath('_gruntfile.coffee'),
        this.gruntfilePath
      );

      // add grunt tasks folder
      ncp(this.templatePath('_grunt/'), this.destinationPath(), function (err) {
        if (err) {
          console.log('NCP module ERROR:', err);
        }
      });

      // add `paths` module
      ncp(this.templatePath('_paths'), this.destinationPath('node_modules'),
        function (err) {
          if (err) {
            console.log('NCP module ERROR:', err);
          }
      });
    }
  },

  end: function () {
    this.npmInstall([], function () {
      // this.spawnCommand('grunt');
    });
  }
});

module.exports = MmCampaignGenerator;
