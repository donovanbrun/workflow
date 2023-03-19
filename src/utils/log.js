let log = (type, msg) => {
    console.log('[' + type + '] ' + (new Date()).toISOString() + " : " + msg)
    //write on a log file ?
}

module.exports = {log}