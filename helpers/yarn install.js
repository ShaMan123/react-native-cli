const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');

const command = 'yarn install --production=false';
child_process.execSync(command);
