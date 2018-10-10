require("../../../builds/devel/pskruntime.js");
const assert = require("double-check").assert;
var fs = require('fs');

const validPath = 'writingTests.txt';
const bufferToAppend = new Buffer('some new content');


function testWriteEmptyBuffer(path) {
    fs.open(path, "w", function (error, fd) {
        fs.write(fd, new Buffer(0), 0, 0, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write null ');
            assert.equal(bytesWritten, 0, 'TEST FAILED: write null - no of bytes');
            fs.close(fd, function () {
                // console.log('file written');
            })
        });
    });
}

function testWriteNull(path) {

    fs.open(path, "w", function (error, fd) {
        fs.write(fd, null, 0, 0, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write null ');
            assert.equal(bytesWritten, 0, 'TEST FAILED: write null - no of bytes');

        });
        fs.close(fd, function () { })
    });
}


function testWriteValidContent(path) {

    fs.open(path, "w", function (error, fd) {
        fs.write(fd, bufferToAppend, 0, bufferToAppend.length, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write valid content');
            assert.equal(bytesWritten, bufferToAppend.length, 'TEST FAILED: write valid content - no of bytes');

            fs.close(fd, function () { });

            fs.open(path, "r", function (error, fd) {
                var readingBuffer = new Buffer(bytesWritten);
                fs.read(fd, readingBuffer, 0, bytesWritten, null, function (err, bytesRead) {

                    if (err) throw err;
                    assert.equal(Buffer.compare(readingBuffer, bufferToAppend), 0, 'TEST FAILED: write valid content - content');
                    fs.close(fd, function () { });
                });
            });
        });
    });
}

function testPartialWrite(path) {
    fs.open(path, "w", function (error, fd) {

        if (error) throw error;
        fs.write(fd, bufferToAppend, 0, 3, 2, function (error, bytesWritten) {
            assert.equal(error, null, 'TEST FAILED: err not null');
            assert.equal(bytesWritten, 3, 'TEST FAILED: partial read no of bytes');

            var readingBuffer = new Buffer(bufferToAppend.length);
            fs.read(fd, readingBuffer, 0, bufferToAppend.length, null, function (err, bytesRead) {

                console.log('readingBuffer', readingBuffer.toString());
                fs.close(fd, function () { });
            });
        });
    });
}

function unlinkFile(path) {

    fs.unlink(path, (err) => {
        if (err) throw err;
        console.log(path, ' was deleted');
    });
}

function testWriteFile(path) {
    fs.writeFile(path, bufferToAppend, function (err) {
        fs.readFile(path, function (err, buffer) {
            console.log(buffer);
            console.log(bufferToAppend);
            assert.equal(buffer.compare(bufferToAppend), 0, 'TEST FAILED: write big file - file');
        });
    });
}

function testWriteHugeFile(path) {
    fs.readFile(path, function (err, buffer) {
        if (err) throw err;
        fs.writeFile('copied.zip', buffer, function (err) {
            if (err) throw err;
            fs.readFile('copy-c.zip', function (err, second_buffer) {
                console.log('buffer', buffer.length, 'second_buffer', second_buffer.length);
                console.log('compare:', second_buffer.compare(buffer));
                assert.equal(second_buffer.compare(buffer), 0, 'TEST FAILED: write huge file - file');
            });
        });
    });
}


var sequence = Promise.resolve();
sequence
    .then(testWriteNull(validPath))
    .then(testWriteEmptyBuffer(validPath))
    .then(testWriteValidContent(validPath))
    .then(testWriteFile(validPath))
    .then(testWriteHugeFile('test.zip'));