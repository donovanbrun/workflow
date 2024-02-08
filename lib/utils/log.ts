const logPath = './logs/';
import * as fs from 'fs';

function getLogFilename() {
    return logPath + 'log_' + (new Date()).toISOString().slice(0, 10) + '.log';
}

function writeLog(msg: string) {
    try {
        fs.writeFile(getLogFilename(), msg + '\n', { flag: 'a+' }, function (err) {
            if (err) {
                console.error(err);
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}

export const log = (type: string, msg: string) => {

    const log = (new Date()).toISOString() + ' [' + type + '] ' + msg;

    switch (type) {
        case 'INFO':
            console.info(log);
            break;
        case 'ERROR':
            console.error(log);
            break;
        default:
            console.log(log);
            break;
    };

    writeLog(log);
}