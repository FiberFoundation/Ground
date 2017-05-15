/* eslint-disable no-var */
import {chalkSuccess} from './chalkConfig';
import rimraf from 'rimraf';
import npmRun from 'npm-run';
import childProcess from 'child_process';

rimraf('.git', error => {
  if (error) throw new Error(error);
  console.log(chalkSuccess('Original Git repository removed.\nInstalling dependencies'));
  childProcess.exec('git init');
  npmRun('install', () => {
    console.log(chalkSuccess('Dependencies successfully installed.'));
  });
});
