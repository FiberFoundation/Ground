// Define prompts for use with npm 'prompt' module in setup script
module.exports = [
  {
    name: 'projectName',
    description: 'Project name',
    pattern: /^[^._][a-z0-9\.\-_~]+$/,
    message: 'Limited to: lowercase letters, numbers, period, hyphen, ' +
             'underscore, and tilde; cannot begin with period or underscore.'
  },
  {
    name: 'version',
    description: 'Version (default: 0.0.1)'
  },
  {
    name: 'author',
    description: 'Author'
  },
  {
    name: 'license',
    description: 'License (default: MIT)'
  },
  {
    name: 'description',
    description: 'Project description'
  }
];
