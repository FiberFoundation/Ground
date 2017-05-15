/* eslint-disable no-var */
/* eslint-disable no-var */
/* eslint-disable no-console */
import {chalkSuccess, chalkProcessing, chalkWarning} from '../chalkConfig';
import rimraf from 'rimraf';
import npmRun from 'npm-run';
import childProcess from 'child_process';

const replace = require("replace");
const prompt = require("prompt");
const prompts = require('./setupPrompts');

prompt.start();

console.log(chalkWarning("WARNING:  Preparing to delete local git repository..."));
prompt.get([{name: 'deleteGit', description: "Delete the git repository?  [Y/n]"}], function(err, result) {
  var deleteGit = result.deleteGit.toUpperCase();

  if (err) process.exit(1);

  function updatePackage() {
    console.log(chalkProcessing('Updating package.json settings:'));

    prompt.get(prompts, function(err, result) {
      // parse user responses
      // default values provided for fields that will cause npm to complain if left empty
      const responses = [
        {
          key: 'name',
          value: result.projectName || 'project'
        },
        {
          key: 'version',
          value: result.version || '0.0.1'
        },
        {
          key: 'author',
          value: result.author || 'Developer'
        },
        {
          key: 'license',
          value: result.license || 'MIT'
        },
        {
          key: 'description',
          value: result.description
        },
        // simply use an empty URL here to clear the existing repo URL
        {
          key: 'url',
          value: ''
        }
      ];

      // update package.json with the user's values
      responses.forEach(res => {
        replace({
          regex: `("${res.key}"): "(.*?)"`,
          replacement: `$1: "${res.value}"`,
          paths: ['package.json'],
          recursive: false,
          silent: true
        });
      });

      // reset package.json 'keywords' field to empty state
      replace({
        regex: /"keywords": \[[\s\S]+?\]/,
        replacement: `"keywords": []`,
        paths: ['package.json'],
        recursive: false,
        silent: true
      });

      // remove setup script from package.json
      replace({
        regex: /\s*"setup":.*,/,
        replacement: "",
        paths: ['package.json'],
        recursive: false,
        silent: true
      });

      // remove all setup scripts from the 'tools' folder
      console.log(chalkSuccess('\nSetup complete! Cleaning up...\n'));
      rimraf('./tools/setup', error => {
        if (error) throw new Error(error);
      });
    });

  }

  if (deleteGit.match(/^N.*/)) updatePackage();
  else {
    // remove the original git repository
    rimraf('.git', error => {
      if (error) throw new Error(error);
      console.log(chalkSuccess('Original Git repository removed.\nInitializing new git repository.'));
      childProcess.exec('git init');
      updatePackage();
    });
  }

  console.log(chalkProcessing('Installing dependencies...'));

  npmRun('install', error => {
    if (error) throw new Error(error);
    console.log(chalkSuccess('Dependencies successfully installed.'));
  });
});
