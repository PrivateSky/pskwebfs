var fs = require('fs');
var functionUndefined = function () {
    throw new Error("Not implemented for node");
}
// const BUFFER_SIZE = 128 * 1024;
var BUFFER_SIZE = 128 * 1024;

module.exports = {
    stat: fs.stat,
    writeFile: writeFileWithChunks,
    readFile: readFileWithChunks,
    createWriteStream: fs.createWriteStream,
    createReadStream: fs.createReadStream,
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

function newReadFile(path, options, callback) {

    var result_buffer = new Buffer(0);
    if (typeof options === 'function') {
        callback = options;
        options = readDefaultOptions;
    }

    fs.stat(path, function (error, stats) {
        if (error) throw error;
        fs.open(path, options.flag, function (error, fd) {

            if (error) throw error;
            var sequence = Promise.resolve();

            // while (stats.size > result_buffer.length) {

            sequence = sequence.then(function () {
                function handler(fd) {
                    return readPartOfFile(fd, function (buffer) {
                        result_buffer = Buffer.concat([result_buffer, buffer]);

                        console.log('length: ', result_buffer.length);
                        if (buffer.length < BUFFER_SIZE) {
                            fs.close(fd, function (err) {
                                if (err) throw err;
                                callback(error, result_buffer.toString(options.encoding));
                            });
                        } else {
                            return handler(fd);
                        }
                    });
                }
                return handler(fd);
            });
            // }
        });
    });
}

function readPartOfFile(fd, callback) {
    return new Promise(function (resolve, reject) {

        var buffer = new Buffer(BUFFER_SIZE);
        fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {

            if (error) throw error;
            if (bytesRead === 0) {
                reject();
            }
            if (bytesRead < BUFFER_SIZE) {
                reject();
            }

            callback(buffer);
            resolve();
        });
    });
}

function readFileWithStream(filename, callback) {
    let readStream = fs.createReadStream(filename,
        { highWaterMark: BUFFER_SIZE });
    let chunks = [];

    readStream.on('error', err => {
        return callback(err);
    });

    readStream.on('data', chunk => {
        chunks.push(chunk);
    });

    readStream.on('close', () => {
        return callback(null, Buffer.concat(chunks));
    });
}

function readFileWithChunks(filePath, callback) {

    var buffer = new Buffer(BUFFER_SIZE);
    var resBuffer = new Buffer(0);

    fs.open(filePath, 'r', function (err, fd) {
        if (err) throw err;
        function readNextChunk() {
            fs.read(fd, buffer, 0, BUFFER_SIZE, null, function (err, nread) {
                if (err) throw err;

                if (nread === 0) {

                    fs.close(fd, function (err) {
                        callback(err, resBuffer);
                        if (err) throw err;
                    });
                    return;
                }

                var data;
                if (nread < BUFFER_SIZE)
                    data = buffer.slice(0, nread);
                else
                    data = buffer;

                // console.log('CHUNK: ', buffer.toString('utf8'));
                resBuffer = Buffer.concat([resBuffer, data]);
                readNextChunk();
            });
        }
        readNextChunk();
    });
}

function writeFileWithChunks(filePath, bufferToAppend, callback) {

    fs.open(filePath, 'w', function (err, fd) {

        if (err) throw err;

        var offset = 0;
        var buffer_size = BUFFER_SIZE;

        if (bufferToAppend.length < BUFFER_SIZE)
            buffer_size = bufferToAppend.length;

        writeNextChunk(fd, bufferToAppend, 0, buffer_size, callback);
    });
}

function writeNextChunk(fd, bufferToAppend, offset, buffer_size, callback) {
    try {

        fs.write(fd, bufferToAppend, offset, buffer_size, offset, function (err, bytesWritten) {

            if (err) throw err;

            if (endOfFile(bytesWritten, offset, buffer_size, bufferToAppend.length)) {

                closeFile(fd, callback);
                return;
            }

            offset += buffer_size;
            if (offset + buffer_size > bufferToAppend.length) {
                buffer_size = bufferToAppend.length - offset;
            }
            writeNextChunk(fd, bufferToAppend, offset, buffer_size, callback);
        });
    } catch (err) {
        console.log('errror', err);
        closeFile(fd, callback);
        return;
    }
}

function endOfFile(bytesWritten, offset, buffer_size, totalLength) {
    return bytesWritten === 0 ||
        bytesWritten < buffer_size ||
        offset + bytesWritten === totalLength
}

function closeFile(fd, callback) {
    fs.close(fd, function (err) {
        callback(err);
        if (err) throw err;
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