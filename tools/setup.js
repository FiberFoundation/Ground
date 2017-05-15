/* eslint-disable no-var */
import {chalkSuccess} from './chalkConfig';
import rimraf from 'rimraf';
import npmRun from 'npm-run';


// remove the original git repository
rimraf('.git', error => {
  if (error) throw new Error(error);
  console.log(chalkSuccess('Original Git repository removed.\nInstalling dependencies'));
  npmRun('install', () => {
    console.log(chalkSuccess('Dependencies successfully installed.'));
  });
});
