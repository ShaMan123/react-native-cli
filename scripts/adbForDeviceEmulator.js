const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');

const isWindows = os.platform() === 'win32';
const adbPath = path.join(process.env.ANDROID_HOME, '/platform-tools/adb');

console.log(chalk.yellow('For more information: https://developer.android.com/studio/command-line/adb'));
tryRunAdbReverse('8081');
getDeviceList();

function tryRunAdbReverse(packagerPort, device) {
    try {

        const adbArgs = ['reverse', `tcp:${packagerPort}`, `tcp:${packagerPort}`];

        // If a device is specified then tell adb to use it
        if (device) {
            adbArgs.unshift('-s', device);
        }

        console.log(chalk.bold(
            `Running ${adbPath} ${adbArgs.join(' ')}`
        ));

        return child_process.execFileSync(adbPath, adbArgs, {
            stdio: [process.stdin, process.stdout, process.stderr]
        });
    } catch (e) {
        console.log(chalk.yellow(`Could not run adb reverse: ${e.message}`));
    }
}

function getDeviceList() {
    try {

        const adbArgs = ['devices'];

        console.log(chalk.bold(
            `Running ${adbPath} ${adbArgs.join(' ')}`
        ));

        return child_process.execFileSync(adbPath, adbArgs, {
            stdio: [process.stdin, process.stdout, process.stderr]
        });
    } catch (e) {
        console.log(chalk.yellow(`Could not run adb reverse: ${e.message}`));
    }
}

function parseDevicesResult(result) {
    if (!result) {
        return [];
    }

    const devices = [];
    const lines = result.trim().split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
        let words = lines[i].split(/[ ,\t]+/).filter(w => w !== '');

        if (words[1] === 'device') {
            devices.push(words[0]);
        }
    }
    return devices;
}

/**
 * Executes the commands needed to get a list of devices from ADB
 * @returns Array<string>
 */
function getDevices() {
    try {
        const devicesResult = child_process.execSync(`${adbPath} devices`);
        return parseDevicesResult(devicesResult.toString());
    } catch (e) {
        return [];
    }
}