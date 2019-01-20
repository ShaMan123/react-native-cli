const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const pathToAndroid = getPathToAndroid(process.cwd());
const processConfig = { stdio: 'inherit', cwd: pathToAndroid };
const isWindows = os.platform() === 'win32';

const args = require('minimist')(process.argv.slice(2), {
    boolean: true,
    default: {
        build: true,
        app: 'com.autodidactrn'
    }
});

try {
    let app;
    const adbDevices = child_process.execSync('node ./adbForDeviceEmulator', { stdio: 'inherit', cwd: __dirname });
    if (args.build) app = child_process.execSync('gradlew app:assembleDebug && gradlew installDebug', { stdio: 'inherit', cwd: pathToAndroid });
    const launchAppTask = launchApp(args.app);
    console.log(chalk.yellow(`node ${process.argv[1]}`));
}
catch (err) {
    console.log('exiting...');
    console.log(chalk.yellow(`node ${process.argv[1]}`));
    process.exit(1);
    packager.kill();
}

function getPathToAndroid(cwd) {
    const baseName = path.basename(cwd);
    const isInAndroidDir = baseName === 'android';
    const androidIsChild = fs.existsSync(path.join(cwd, 'android'));
    const androidIsSibling = fs.existsSync(path.join(cwd, '../android'));

    if (isInAndroidDir) return cwd;
    else if (androidIsChild) return path.join(cwd, 'android');
    else if (androidIsSibling) return path.join(cwd, '../android');
    else {
        console.log(chalk.red(`couldn\'t find android at the vicinity of ${cwd}`));
        process.exit(1);
    }
}

function launchPackager() {
    const packagerConfig = { cwd: pathToAndroid, detached: true };
    //if (isWindows) packagerConfig.stdio = 'ignore';
    return child_process.exec('node ./launchPackager', { stdio: 'inherit', cwd: __dirname });
}

function launchApp(appName) {
    const adbPath = path.resolve(process.env.ANDROID_HOME, 'platform-tools', 'adb');
    const packager = launchPackager();
    const adbArgs = ['shell', 'am', 'start', '-n', `${appName}/${appName}.MainActivity`];
    const launchApp = child_process.spawnSync(adbPath, adbArgs, { stdio: 'inherit', cwd: pathToAndroid });
}





