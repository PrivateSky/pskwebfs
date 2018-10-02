require("../../../builds/devel/pskruntime.js");
const assert = require("double-check").assert;
var abstractFs = require('../lib/fs');

const validPath = 'mynewfile.txt';
const contentOfValidFile = 'Hello, world!';


function testRead(path) {
    abstractFs.stat(path, function (error, stats) {
        abstractFs.open(path, "r+", function (error, fd) {

            if (error) throw error;
            var buffer = new Buffer(stats.size);
            abstractFs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
                assert.equal(error, null, 'TEST FAILED: err not null');
                assert.equal(bytesRead, stats.size, 'TEST FAILED - READ - no of bytes');
                var data = buffer.toString("utf8");
                assert.equal(data, contentOfValidFile, 'TEST FAILED: read');
            });

            abstractFs.close(fd, function (err) { });
        });
    });
}

function testPartialRead(path) {

    abstractFs.open(path, "r", function (error, fd) {

        if (error) throw error;
        var bufferLength = 3;
        var buffer = new Buffer(bufferLength);
        abstractFs.read(fd, buffer, 0, bufferLength, 2, function (error, bytesRead, buffer) {
            assert.equal(error, null, 'TEST FAILED: err not null');
            assert.equal(bytesRead, bufferLength, 'TEST FAILED: partial read no of bytes');
            var data = buffer.toString("utf8");
            assert.equal('llo', data, 'TEST FAILED: partial read');

            abstractFs.close(fd, function (err) { });
        });
    });
}

function testReadHugeFile(path) {
    abstractFs.readFile(path, function (err, buffer) {
        console.log('err ', err);
        console.log('testReadHugeFile', buffer.length);
        console.timeEnd('testReadHugeFile');
    });
}
testRead(validPath);
testPartialRead(validPath);

console.time('testReadHugeFile');
testReadHugeFile(validPath);
// testReadHugeFile('EmimStoma.zip');
// console.time('readFileWithStream');
// readFileWithStream('EmimStoma.zip', function (err, buffer) {
//     console.log('readFileWithStream', buffer.length);
//     console.timeEnd('readFileWithStream');
// });