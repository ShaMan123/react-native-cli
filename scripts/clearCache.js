const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();

const processConfig = { stdio: 'inherit', cwd: __dirname };
const adbPath = path.resolve(process.env.ANDROID_HOME, 'platform-tools', 'adb');
const isWindows = os.platform() === 'win32';

const commands = {
    npm: {
        cmd: 'npm cache clean --force',
        processConfig
    },
    yarn: {
        cmd: 'yarn cache clean',
        processConfig
    },
    reactNative: {
        cmd: 'react-native start --reset-cache',//'react-native run-android -- --reset-cache', //'react-native start --reset-cache',
        processConfig: {
            ...processConfig,
            detached: true,
            stdio: isWindows ? 'ignore' : 'inherit',
            cwd: process.cwd()
        },
        appendListeners(process) {

        }
    }
};

clearCache();

function clearCache() {
    try {
        Object.keys(commands).map((lib) => {
            const response = prompt(`Clear cache for ${lib}?`, 'no');
            if (response && response.match('y')) {
                child_process.execSync(commands[lib].cmd, commands[lib].processConfig);
            }
        });
    }
    catch (err) {
        //console.error(err);
    }
}

