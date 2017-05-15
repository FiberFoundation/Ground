/* eslint-disable no-var */
/* eslint-disable no-console */
const chalk = require('chalk');
const chalkSuccess = chalk.green;
const chalkProcessing = chalk.blue;
const chalkWarning = chalk.yellow;
const rimraf = require('rimraf');
const childProcess = require('child_process');
const replace = require("replace");
const prompt = require("prompt");
const prompts = require('./setupPrompt');

prompt.start();

function updatePackage() {
  prompt.get(prompts, function(err, result) {
    // parse user responses
    // default values provided for fields that will cause npm to complain if left empty
    const responses = [
      {key: 'name', value: result.projectName || 'project'},
      {key: 'version', value: '0.0.1'},
      {key: 'author', value: result.author || 'Developer'},
      {key: 'license', value: result.license || 'MIT'},
      {key: 'description', value: ''},
      // simply use an empty URL here to clear the existing repo URL
      {key: 'url', value: ''}
    ];

    // update package.json with the user's values
    responses.forEach(function(res) {
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

    console.log(chalkProcessing('Cleaning up...'));
    rimraf('./tools/setup', function(error) {
      if (error) throw new Error(error);
      console.log(chalkSuccess('\nSetup complete!\n'));
    });
  });
}

console.log(chalkSuccess('Dependencies successfully installed.'));
console.log(chalkWarning("WARNING:  Preparing to delete local git repository..."));

// remove the original git repository
rimraf('.git', function(error) {
  if (error) throw new Error(error);
  console.log(chalkProcessing('Initializing new git repository...'));
  childProcess.exec('git init');
  updatePackage();
});
