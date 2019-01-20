#!/usr/bin/env node

const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Autodidact', { horizontalLayout: 'full' })
  )
);

const args = require('minimist')(process.argv.splice(2));
const command = args._[0];

switch (command) {
    case 'adb':
        require('./scripts/adbForDeviceEmulator');
        break;
    case 'cacheClear':
    case 'cache-clear':
    case 'clear-cache':
        require('./scripts/clearCache');
        break;
    case 'killAndroid':
    case 'kill-android':
        require('./scripts/killAndroid');
        break;
    case 'launchPackager':
    case 'launch-packager':
        require('./scripts/launchPackager');
        break;
    case 'runAndroid':
    case 'run-android':
        require('./scripts/runAndroid');
        break;
    case 'setEnvVar':
        require('./scripts/setEnviromentVariables');
        break;
    default:
        console.log(chalk.red(`invalid command ${command}`));
        break;
}