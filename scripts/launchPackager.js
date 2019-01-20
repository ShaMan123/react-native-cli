const os = require('os');
const child_process = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

const isWindows = os.platform() === 'win32';
const fileName = isWindows ? 'launchPackager.bat' : 'launchPackager.command';

const pathToRNScripts = path.join(process.cwd(), 'node_modules/react-native/scripts');
const pathToScript = path.join(pathToRNScripts, fileName);

startServerInNewWindow(8081);

function startServerInNewWindow(port) {
    const scriptFile = /^win/.test(process.platform) ?
        'launchPackager.bat' :
        'launchPackager.command';
    const scriptsDir = pathToRNScripts;
    const launchPackagerScript = path.resolve(scriptsDir, scriptFile);
    const procConfig = { cwd: scriptsDir };
    const terminal = process.env.REACT_TERMINAL;

    // setup the .packager.env file to ensure the packager starts on the right port
    const packagerEnvFile = path.join(scriptsDir, '.packager.env');
    const content = `export RCT_METRO_PORT=${port}`;
    // ensure we overwrite file by passing the 'w' flag
    fs.writeFileSync(packagerEnvFile, content, { encoding: 'utf8', flag: 'w' });

    if (process.platform === 'darwin') {
        if (terminal) {
            return child_process.spawnSync('open', ['-a', terminal, launchPackagerScript], procConfig);
        }
        return child_process.spawnSync('open', [launchPackagerScript], procConfig);

    } else if (process.platform === 'linux') {
        procConfig.detached = true;
        if (terminal) {
            return child_process.spawn(terminal, ['-e', 'sh ' + launchPackagerScript], procConfig);
        }
        return child_process.spawn('sh', [launchPackagerScript], procConfig);

    } else if (/^win/.test(process.platform)) {
        procConfig.detached = true;
        procConfig.stdio = 'ignore';
        return child_process.spawn('cmd.exe', ['/C', launchPackagerScript], procConfig);
    } else {
        console.log(chalk.red(`Cannot start the packager. Unknown platform ${process.platform}`));
    }
}
