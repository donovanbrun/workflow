import * as fs from 'fs';

const logPath = './logs/';

export enum LogType {
    INFO = 'INFO',
    ERROR = 'ERROR',
    DEBUG = 'DEBUG'
}

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

export const log = (type: LogType, msg: string) => {

    const log = (new Date()).toISOString() + ' [' + type + '] ' + msg;

    switch (type) {
        case LogType.INFO:
            console.info(log);
            break;
        case LogType.ERROR:
            console.error(log);
            break;
        case LogType.DEBUG:
            console.debug(log);
            break;
        default:
            console.log(log);
            break;
    };

    //writeLog(log);
}