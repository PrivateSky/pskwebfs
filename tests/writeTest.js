require("../../../builds/devel/pskruntime.js");
const assert = require("double-check").assert;
var abstractFs = require('../lib/fs');

const validPath = 'writingTests.txt';
const bufferToAppend = new Buffer('some new content');


function testWriteEmptyBuffer(path) {
    abstractFs.open(path, "w", function (error, fd) {
        abstractFs.write(fd, new Buffer(0), 0, 0, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write null ');
            assert.equal(bytesWritten, 0, 'TEST FAILED: write null - no of bytes');
            abstractFs.close(fd, function () {
                // console.log('file written');
            })
        });
    });
}

function testWriteNull(path) {

    abstractFs.open(path, "w", function (error, fd) {
        abstractFs.write(fd, null, 0, 0, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write null ');
            assert.equal(bytesWritten, 0, 'TEST FAILED: write null - no of bytes');

        });
        abstractFs.close(fd, function () { })
    });
}


function testWriteValidContent(path) {

    abstractFs.open(path, "w", function (error, fd) {
        abstractFs.write(fd, bufferToAppend, 0, bufferToAppend.length, null, function (err, bytesWritten) {

            assert.true(error === null, 'TEST FAILED: error write valid content');
            assert.equal(bytesWritten, bufferToAppend.length, 'TEST FAILED: write valid content - no of bytes');

            abstractFs.close(fd, function () { });

            abstractFs.open(path, "r", function (error, fd) {
                var readingBuffer = new Buffer(bytesWritten);
                abstractFs.read(fd, readingBuffer, 0, bytesWritten, null, function (err, bytesRead) {

                    if (err) throw err;
                    assert.equal(Buffer.compare(readingBuffer, bufferToAppend), 0, 'TEST FAILED: write valid content - content');
                    abstractFs.close(fd, function () { });
                });
            });
        });
    });
}

function testPartialWrite(path) {
    abstractFs.open(path, "w", function (error, fd) {

        if (error) throw error;
        abstractFs.write(fd, bufferToAppend, 0, 3, 2, function (error, bytesWritten) {
            assert.equal(error, null, 'TEST FAILED: err not null');
            assert.equal(bytesWritten, 3, 'TEST FAILED: partial read no of bytes');

            var readingBuffer = new Buffer(bufferToAppend.length);
            abstractFs.read(fd, readingBuffer, 0, bufferToAppend.length, null, function (err, bytesRead) {

                console.log('readingBuffer', readingBuffer.toString());
                abstractFs.close(fd, function () { });
            });
        });
    });
}

function unlinkFile(path) {

    abstractFs.unlink(path, (err) => {
        if (err) throw err;
        console.log(path, ' was deleted');
    });
}

function testWriteFile(path) {
    abstractFs.writeFile(path, bufferToAppend, function (err) {
        abstractFs.readFile(path, function (err, buffer) {
            console.log(buffer);
            console.log(bufferToAppend);
            assert.equal(buffer.compare(bufferToAppend), 0, 'TEST FAILED: write big file - file');
        });
    });
}

function testWriteHugeFile(path) {
    abstractFs.readFile(path, function (err, buffer) {
        if (err) throw err;
        abstractFs.writeFile('copy-c.zip', buffer, function (err) {
            if (err) throw err;
            abstractFs.readFile('copy-c.zip', function (err, second_buffer) {
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
    .then(testWriteHugeFile('PrivateSky-iOS.zip'))
    // .then(testWriteHugeFile(validPath))
    // .then(unlinkFile(validPath));