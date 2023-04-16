const config = require('../config/config')
const fs = require("fs")
const { stringify } = require("csv-stringify")

function writeCSV(filename, columns, data) {
    const writableStream = fs.createWriteStream(config.output + filename)
    const stringifier = stringify({ header: true, columns: columns })
    data.forEach(element => {
        stringifier.write(element)
    });

    stringifier.pipe(writableStream)
}

module.exports = { writeCSV }