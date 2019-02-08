//const os = require('os');
const child_process = require('child_process');
//const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const prompt = require('prompt-sync')();


module.exports = function changeDirFiles(folderPath, ext) {
    if (fs.existsSync(folderPath)) {
        fs.readdirSync(folderPath).forEach(function (file, index) {
            let curPath = path.resolve(folderPath, file);
            
            let tsFilePath = path.format({
                //base: path.basename(curPath,'.js'),
                dir: path.dirname(curPath),
                ext,
                name: path.basename(curPath, '.js')
            });
            
            if (path.extname(curPath) === '.js') {
                fs.writeFileSync(tsFilePath, fs.readFileSync(curPath));
                fs.unlinkSync(curPath);
            }
        });
        
    }
}
