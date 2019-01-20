const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');

const isWindows = os.platform() === 'win32';
const setterOperator = isWindows ? 'SET' : 'env';
const baseDir = process.env.USERPROFILE;
const directory = `${baseDir}/AppData/Local/Android/Sdk`.replace(/\\/g, '/');
const command = `${setterOperator} ANDROID_HOME=${directory}`;

console.log(chalk.bold(`Setting ANDROID_HOME`));
child_process.spawnSync(command, {
    stdio: [process.stdin, process.stdout, process.stderr],
});
console.log(chalk.yellow(`ANDROID_HOME = ${process.env.ANDROID_HOME}`));

if (process.env.ANDROID_HOME.replace(/\\/g,'/') !== directory) {
    console.log(chalk.red(`Couldn\'t set ANDROID_HOME`));
    console.log(chalk.bold(`Run this command:`));
    console.log(chalk.blue(command));
}