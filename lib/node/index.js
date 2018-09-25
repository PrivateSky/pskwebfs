var fs = require('fs');
var functionUndefined = function () {
    throw new Error("Not implemented for node");
}
module.exports = {
    stat: fs.stat,
    writeFile: writeFile,
    readFile: readFile,
    createWriteStream: functionUndefined,
    createReadStream: functionUndefined,
    open: fs.open,
    close: fs.close,
    read: fs.read,
    write: fs.write,
    unlink: fs.unlink,
    readDir: functionUndefined,
    statSync: functionUndefined,
    writeFileSync: functionUndefined,
    readFileSync: functionUndefined,
    existsSync: functionUndefined,
    mkdirSync: functionUndefined,
    unlinkSync: functionUndefined,
    rmdirSync: functionUndefined
};

const readDefaultOptions = {
    encoding: 'utf8',
    flag: 'r'
}

function readFile(path, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = readDefaultOptions;
    }
    fs.stat(path, function (error, stats) {
        fs.open(path, options.flag, function (error, fd) {

            if (error) throw error;
            var buffer = new Buffer(stats.size);
            fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {

                if (error) throw error;
                fs.close(fd, function (err) {
                    if (err) throw err;
                    callback(error, buffer.toString(options.encoding));
                });
            });
        });
    });
}

const writeDefaultOptions = {
    encoding: 'utf8',
    mode: 0o666,
    flag: 'w'
}

function writeFile(path, data, options, callback) {

    if (typeof options === 'function') {
        callback = options;
        options = writeDefaultOptions;
    }
    fs.open(path, options.flag, function (error, fd) {
        fs.write(fd, data, 0, data.length, null, function (error, bytesWritten) {

            if (error) throw error;
            if (bytesWritten !== data.length) throw new Error('Different no of bytes written');
            fs.close(fd, function (err) {
                callback(error);
            });
        });
    });
}