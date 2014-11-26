'use strict';
var util    = require('util'),
    path    = require('path'),
    yeoman  = require('yeoman-generator'),
    yosay   = require('yosay'),
    parser  = require('../internal_modules/parse-tree/')(yeoman),
    build   = require('../internal_modules/build-tree/')(yeoman),

var MmCampaignGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
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
            choices: ['HTML', 'Jade'],
            default: 0
          },

          style: {
            type: 'list',
            name: 'style',
            message: 'Which stylesheet language would you prefer to use?',
            choices: ['CSS', 'Less'],
            default: 0
          },

          scriptInVars: {
            type: 'list',
            name: 'scriptInVars',
            message: 'Which scripting language would you like to use in variants?',
            choices: ['JS', 'Coffee'],
            default: 0
          },

          scriptInScripts: {
            type: 'list',
            name: 'scriptInScripts',
            message: 'Which scripting language would you like to use for campaign scripts?',
            choices: ['JS', 'Coffee'],
            default: 0
          },

          helpers: {
            type: 'checkbox',
            name: 'helpers',
            message: 'Please select the scripts you will need for your campaign',
            choices: ['Render', 'checker', 'actions', 'templater', 'utils']
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
            removePrompt('coffeeInVars');
          }

          if (!campaign.hasEmptyScripts) {
            removePrompt('coffeeInScripts');
          }

          promptSequence.forEach(function (el) {
            userPrompts.push(prompts[el]);
          });
        },

        getUserConfig = function (props) {
          var prop, config = {};

          for (prop in props) {
            config[prop] = props[prop];
          }

          return config;
        };

    this.campaign = parser(this.destinationRoot());

    console.log(this.campaign);

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

      // 1. create app structure





      // 2. create package.json
      // 3. create Gruntfile
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  end: function () {
    // this.installDependencies({
    //   callback: (function () {
    //     this.spawnCommand('grunt').on('close', (function () {
    //       yeoman.file.delete('Gruntfile.coffee');
    //       fs.renameSync('_Gruntfile.js', 'Gruntfile.js');

    //       editor.insertConfig('compass', '{ foo: bar }');
    //       console.log(editor.toString());

    //       // buildGruntFile();
    //       this.spawnCommand('grunt');
    //     }).bind(this));
    //   }).bind(this)
    // });
  }
});

module.exports = MmCampaignGenerator;
