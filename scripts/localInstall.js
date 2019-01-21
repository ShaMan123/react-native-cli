//const os = require('os');
const child_process = require('child_process');
//const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

function localInstall() {
    const exampleAppName = require(path.resolve(process.cwd(), './package.json')).name;
    const repoName = require(path.resolve(process.cwd(), '../package.json')).name;
    const pathToLoop = path.resolve(process.cwd(), exampleAppName, 'node_modules', repoName, exampleAppName);
    child_process.execSync(`yarn add ${packageName}@file:..`);
    console.log(pathToLoop);
    //fs.rmdirSync()
}

localInstall()

module.exports = localInstall;