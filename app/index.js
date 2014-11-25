'use strict';
var util    = require('util'),
    path    = require('path'),
    yeoman  = require('yeoman-generator'),
    yosay   = require('yosay'),
    parser  = require('../internal_modules/campaign-parser/')(yeoman);

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

          isJade: {
            type: 'confirm',
            name: 'isJade',
            message: 'Would you like to use jade instead of html in variants?',
            default: false
          },

          styletool: {
            type: 'list',
            name: 'styletool',
            message: 'What stylesheet language would you prefer to use?',
            choices: ['CSS', 'Less', 'Saas'],
            default: 0
          },

          coffeeInVars: {
            type: 'confirm',
            name: 'coffeeInVars',
            message: 'Would you like to use coffeescript in variants?',
            default: false
          },

          coffeeInScripts: {
            type: 'confirm',
            name: 'coffeeInScripts',
            message: 'Would you like to use coffeescript for campaign scripts?',
            default: false
          },

          scripts: {
            type: 'checkbox',
            name: 'scripts',
            message: 'Please select the scripts you will need for your campaign',
            choices: ['render', 'checker', 'actions', 'micro templater', 'utils']
          }
        },

        userPropsList = [
          'campaignName',
          'isJade',
          'styletool',
          'coffeeInVars',
          'coffeeInScripts',
          'scripts'
        ],

        userPrompts = [],

        removePrompt = function (promptName) {
          userPropsList.splice(userPropsList.indexOf(promptName), 1);
        };

    this.campaign = parser(this.destinationRoot());

    if (!this.campaign.hasEmptyVars) {
      removePrompt('isJade');
      removePrompt('styletool');
      removePrompt('coffeeInVars');
    }

    if (!this.campaign.hasEmptyScripts) {
      removePrompt('coffeeInScripts');
    }

    userPropsList.forEach(function (el) {
      userPrompts.push(prompts[el]);
    });

    this.log(yosay(
      'Welcome to the Maxymiser campaign generator!'
    ));

    this.prompt(userPrompts, function (props) {
      this.userConfig = {
        name: props.campaignName,
        isJade: props.isJade,
        styletool: props.styletool,
        coffeeInVars: props.coffeeInVars,
        coffeeInScripts: props.coffeeInScripts,
        scripts: props.scripts
      };

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
