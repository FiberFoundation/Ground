/* eslint-disable no-var */
/* eslint-disable no-console */
var chalk = require('chalk');
var chalkSuccess = chalk.green;
var chalkProcessing = chalk.blue;
var chalkWarning = chalk.yellow;
var rimraf = require('rimraf');
var childProcess = require('child_process');
var replace = require("replace");
var prompt = require("prompt");
var prompts = require('./setupPrompt');

prompt.start();

function updatePackage() {
  prompt.get(prompts, function(err, result) {
    // parse user responses
    // default values provided for fields that will cause npm to complain if left empty
    const responses = [
      {key: 'name', value: result.projectName || 'project'},
      {key: 'version', value: result.version || '0.0.1'},
      {key: 'author', value: result.author || 'Developer'},
      {key: 'license', value: result.license || 'MIT'},
      {key: 'description', value: result.description},
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

    installDependencies();
    //      rimraf('./tools/setup', function(error) {
    //        if (error) throw new Error(error);
    //      });
  });
}

function installDependencies() {
  console.log(chalkProcessing('Installing dependencies...'));

  childProcess.exec('npm install', function(error) {
    if (error) throw new Error(error);
    console.log(chalkSuccess('Dependencies successfully installed.'));
    console.log(chalkSuccess('\nSetup complete!\n'));
  });
}

console.log(chalkWarning("WARNING:  Preparing to delete local git repository..."));
prompt.get([{name: 'deleteGit', description: "Delete the git repository?  [Y/n]"}], function(err, result) {
  var deleteGit = result.deleteGit.toUpperCase();
  if (err) process.exit(1);
  if (deleteGit.match(/^N.*/)) updatePackage();
  else {
    // remove the original git repository
    rimraf('.git', function(error) {
      if (error) throw new Error(error);
      console.log(chalkSuccess('Original Git repository removed.\nInitializing new git repository.'));
      childProcess.exec('git init');
      updatePackage();
    });
  }
});
