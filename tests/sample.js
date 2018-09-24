require("../../../builds/devel/pskruntime.js");
var fileManager = require('./../file-manager')
const assert = require("double-check").assert;
// const assert = require("double-check").assert;
// const arr1 = [1, 2, 3];
// const arr2 = [1, 2];
// assert.equal('1', 1, "Values don't match");
//assert.true(arr1.length === arr2.length, "Arrays sizes don't match");

const testName = "test-write-file"
const fileContent = new Buffer("Hello, world!");
const contentToAppend = new Buffer(" spy ");
const filePath = "mynewfile.txt";

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
}

function init(cb) {
    this.cb = cb;

    testCreatedFile();

    testAppendFile();
}

function createFile() {
    fileManager.createFile(filePath, fileContent);
}

function testCreatedFile() {
    createFile();
    fileManager.readFile(filePath, function (err, buffer) {
        assert.equal(Buffer.compare(buffer, fileContent), 0, "Create/Write Test");
    });
}

function testAppendFile() {

    fileManager.appendFile(filePath, contentToAppend, 3, function () {

        fileManager.readFile(filePath, function (err, buffer) {

            const offset = 3;
            let firstPart = fileContent.slice(0, offset);
            let secondPart = Buffer.concat([contentToAppend,
                fileContent.slice(offset)]);
            let content = Buffer.concat([firstPart, secondPart]);

            console.log(content.toString(), 'FILE CONTENT');
            console.log(buffer.toString(), 'BUFFER');

            assert.true(Buffer.compare(buffer, fileContent), 0, "Append Test");
        });
    });
}


function testOpen() {
    fileManager.open(filePath, 'r', function (err, fd) {
        assert.notNull()
    });
}

assert.callback(testName, function (callback) {
    f.init(callback);
}, 1000);