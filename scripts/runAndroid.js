const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const pathToAndroid = getPathToAndroid(process.cwd());
const isWindows = os.platform() === 'win32';

function runAndroid(shouldInstallBuild = true) {
    let app, packager, adbDevices, launchAppTask;
    try {
        packager = child_process.exec(`node ${path.join(__dirname, 'launchPackager')}`, {
            stdio: isWindows ? 'ignore' : 'inherit',
            cwd: path.join(pathToAndroid, '..'),
            detached: true
        });
        
        adbDevices = child_process.execSync('node ./adbForDeviceEmulator', { stdio: 'inherit', cwd: __dirname });
        if (shouldInstallBuild) app = child_process.execSync('gradlew app:assembleDebug && gradlew installDebug', { stdio: 'inherit', cwd: pathToAndroid });
        launchAppTask = launchApp();
    }
    catch (err) {
        console.log('exiting...');
        killDetachedProcess(packager);
        process.exit(1);
    }
}

function killDetachedProcess(subProcess) {
    try {
        process.kill(-subProcess.pid, 'SIGINT');
    }
    catch (err) {
        return;
    }
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

function getPackageNameWithSuffix(appId, appIdSuffix) {
    const packageName = fs
        .readFileSync(`${pathToAndroid}/app/src/main/AndroidManifest.xml`, 'utf8')
        .match(/package="(.+?)"/)[1];

    if (appId) {
        return appId;
    } else if (appIdSuffix) {
        return packageName + '.' + appIdSuffix;
    }
    else {
        return packageName;
    }
}

function launchApp() {
    const packageName = fs
        .readFileSync(`${pathToAndroid}/app/src/main/AndroidManifest.xml`, 'utf8')
        .match(/package="(.+?)"/)[1];
    const adbPath = path.resolve(process.env.ANDROID_HOME, 'platform-tools', 'adb');
    const adbArgs = ['shell', 'am', 'start', '-n', `${packageName}/${packageName}.MainActivity`];
    return child_process.spawnSync(adbPath, adbArgs, { stdio: 'inherit', cwd: pathToAndroid });
}

module.exports = runAndroid;





