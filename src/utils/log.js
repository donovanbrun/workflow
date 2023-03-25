let log = (type, msg) => {
    console.log((new Date()).toISOString() + ' [' + type + '] ' + msg)
    //write on a log file ?
}

module.exports = {log}