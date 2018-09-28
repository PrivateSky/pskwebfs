var fs = require('fs');
var functionUndefined = function () {
    throw new Error("Not implemented for node");
}
const BUFFER_SIZE = 4;

module.exports = {
    stat: fs.stat,
    writeFile: writeFile,
    readFile: readFileWithChunks,
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

function newReadFile(path, options, callback) {

    var result_buffer = new Buffer(0);
    if (typeof options === 'function') {
        callback = options;
        options = readDefaultOptions;
    }

    fs.open(path, options.flag, function (error, fd) {

        if (error) throw error;
        var sequence = Promise.resolve();

        // while (true) {

        sequence = sequence.then(function () {
            readPartOfFile(fd, function (buffer) {
                result_buffer = Buffer.concat([result_buffer, buffer]);
            });
        })
        // }
        fs.close(fd, function (err) {
            if (err) throw err;
            callback(error, result_buffer.toString(options.encoding));
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
            if (bytes_read < BUFFER_SIZE) {
                reject();
            }
            callback(buffer);
            resolve();
        });
    });
}

const readFileWithStream = (filename, callback) => {
    let readStream = fs.createReadStream(filename);
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
    var CHUNK_SIZE = 2;
    var buffer = new Buffer(CHUNK_SIZE);
    var resBuffer = new Buffer(0);

    fs.open(filePath, 'r', function (err, fd) {
        if (err) throw err;
        function readNextChunk() {
            fs.read(fd, buffer, 0, CHUNK_SIZE, null, function (err, nread) {
                if (err) throw err;

                if (nread === 0) {

                    fs.close(fd, function (err) {
                        callback(err, resBuffer.toString('utf8'));
                        if (err) throw err;
                    });
                    return;
                }

                var data;
                if (nread < CHUNK_SIZE)
                    data = buffer.slice(0, nread);
                else
                    data = buffer;

                console.log('CHUNK: ', buffer.toString('utf8'));
                resBuffer = Buffer.concat([resBuffer, buffer]);
                readNextChunk();
            });
        }
        readNextChunk();
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