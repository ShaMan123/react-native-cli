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
/*
const args = require('minimist')(process.argv.splice(2));
const command = args._[0];
/*
let Commands= {
    adb,
    cacheClear,
    killAndroid,
    launchPackager,
    runAndroid,
    setEnvVar
}
*/
const program = require('commander');
const package = require('./package.json');

if (process.argv.length <= 2) {
    errorMessage();
}

program
    .usage('<command> [...options]')
    .version(package.version);

program
    .command('adb [options]')
    .option('--list', 'get device list')
    .option('--port', 'specify port')
    .option('--device', 'specify device Id')
    .description('start adb')
    .action(function (cmd, options) {
        const { getDevices, logHelp, tryRunAdbReverse } = require('./scripts/adbForDeviceEmulator');
        logHelp();
        tryRunAdbReverse(options.port, options.device);
        if (options.list) console.log('Devices:\n' + chalk.bold(getDevices()));
    });

program
    .command('cacheClean')
    .description('cleans cache for npm, yarn, react-native')
    .alias('cacheClear')
    .alias('cleanCache')
    .alias('clearCache')
    .action(function (cmd, options) {
        require('./scripts/clearCache');
    });

program
    .command('killAndroid')
    .alias('kill-android')
    .description('stops Daemon')
    .action(function (cmd, options) {
        require('./scripts/killAndroid');
    });

program
    .command('launchPackager')
    .alias('bundle')
    .description('launchs react-native package bundler from cwd')
    .action(function (cmd, options) {
        require('./scripts/launchPackager');
    });

program
    .command('local-install')
    .alias('localInstall')
    .description('Installs the parent package in the cwd, cwd must be the direct child of package')
    .action(function (cmd, options) {
        require('./scripts/localInstall')();
    });

program
    .command('runAndroid [options]')
    .alias('run-android [options]')
    .description('launchs react-native package bundler from cwd')
    .option('-B, --build', 'build the app')
    .action(function (cmd, options) {
        const buildFlag = options.parent.rawArgs.find((cmd) => cmd.match('^(-B|--build)'));
        const buildArg = buildFlag && buildFlag.split('=')[1] && buildFlag.split('=')[1] === 'false' ? false : true;
        require('./scripts/runAndroid')(buildArg);
    });

program.on('command:*',errorMessage);
program.parse(process.argv);

function errorMessage(cmd, exit = true) {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', cmd);
    if (exit) process.exit(1);
}
