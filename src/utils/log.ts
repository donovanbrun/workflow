export const log = (type: string, msg: string) => {
    console.log((new Date()).toISOString() + ' [' + type + '] ' + msg)
    //write on a log file ?
}