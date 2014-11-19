module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    campaign_to_json:
      all:
        files: '': '.'

    json_to_src:
      all:
        files: '': 'campaign.json'

  grunt.loadNpmTasks 'grunt-campaign-to-json';
  grunt.loadNpmTasks 'grunt-json-to-src';

  grunt.registerTask('default', ['campaign_to_json', 'json_to_src']);
