const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt');

//const adb = require('react-native/local-cli/runAndroid/adb');

const cwd = path.dirname(__dirname);
const pathToAndroid = getPathToAndroid(cwd);
/*
const processConfig = { stdio: 'inherit', cwd };
const adbPath = path.resolve(process.env.ANDROID_HOME, 'platform-tools', 'adb');
const isWindows = os.platform() === 'win32';
*/
try {
    clearAPK();

    var property = {
        name: 'yesno',
        message: `Want to stop gradlew?`,
        validator: /y[es]*|n[o]?/,
        warning: 'Must respond yes or no',
        default: 'yes'
    };

    prompt.get(property, function (err, result) {
        if (result.yesno[0] === 'y') {
             child_process.execSync('gradlew --stop', { stdio: 'inherit', cwd: pathToAndroid });
        }

        property = {
            name: 'yesno',
            message: `Want to clean gradlew? It takes a few minutes to rebuild afterwards (use only if despaired)`,
            validator: /y[es]*|n[o]?/,
            warning: 'Must respond yes or no',
            default: 'no'
        };
        prompt.get(property, function (err, result) {
            if (result.yesno[0] === 'y') {
                child_process.execSync('gradlew clean', { stdio: 'inherit', cwd: pathToAndroid });
            }
        });
    });
}
catch (err) {
    console.log('exiting...');
}

function clearAPK() {
    console.log(chalk.bold('clearing adb apks'));
    console.log(chalk.bold('https://stackoverflow.com/questions/4709137/solution-to-install-failed-insufficient-storage-error-on-android'));
    const cwd = path.resolve(process.env.USERPROFILE, 'AppData', 'Local', 'Android', 'Sdk', 'platform-tools');
    const processConfig = { stdio: 'inherit', cwd };
    try {
        child_process.execSync('adb shell "pm uninstall AutodidactRN"', processConfig);
    }
    catch (err) {console.log(chalk.red(err))}
    child_process.execSync('adb shell "rm -rf /data/app/AutodidactRN-*"', processConfig);
    child_process.execSync('adb shell "rm -rf /data/local/tmp/*"', processConfig);

    //var c = child_process.spawnSync('adb', ['shell', 'rm', '-rf', '/data/local/tmp/*'], processConfig);
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