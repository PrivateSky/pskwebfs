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

            var readingBuffer = new Buffer(bufferToAppend.length);
            abstractFs.read(fd, readingBuffer, 0, bufferToAppend.length, null, function (err, bytesRead) {

                assert.true(Buffer.compare(readingBuffer, bufferToAppend), 0, 'TEST FAILED: write valid content - content');
                abstractFs.close(fd, function () { });
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
        console.log('err ', err);
    });
}


testWriteNull(validPath);
testWriteEmptyBuffer(validPath);
testWriteValidContent(validPath);

testWriteFile(validPath);
// testPartialWrite(validPath);

unlinkFile(validPath);