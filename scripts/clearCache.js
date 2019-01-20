const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

//const adb = require('react-native/local-cli/runAndroid/adb');

const cwd = path.dirname(__dirname);
const pathToAndroid = path.resolve(cwd, 'android');
const processConfig = { stdio: 'inherit', cwd };
const adbPath = path.resolve(process.env.ANDROID_HOME, 'platform-tools', 'adb');
const isWindows = os.platform() === 'win32';

const commands = {
    npm: 'npm cache clean --force',
    yarn: 'yarn cache clean',
    reactNative: 'react-native start --reset-cache',//'react-native run-android -- --reset-cache', //'react-native start --reset-cache',
}

clearCache();

function clearCache() {
    try {
        Object.keys(commands).map((lib) => {
            if (prompt(`Clear cache for ${lib}?`, 'yes')) child_process.execSync(commands[lib], processConfig);
        });
    }
    catch (err) {
        console.log('err...');
    }
}

