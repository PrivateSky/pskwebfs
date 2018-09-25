require("../../../builds/devel/pskruntime.js");
// var fileManager = require('./../file-manager')
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

function test() {
    assert.equal('1', 1, "Values don't match");
}

test();

// String.prototype.insertAt = function (index, string) {
//     return this.substr(0, index) + string + this.substr(index);
// }

// var f = $$.flow.create(testName, {
//     init: function (cb) {
//         this.cb = cb;
//         this.filePath = "mynewfile.txt";


//         this.testCreatedFile();

//         this.testAppendFile();
//     },

//     createFile: function () {
//         fileManager.createFile(this.filePath, fileContent);
//     },

//     testCreatedFile: function () {
//         this.createFile();
//         fileManager.readFile(this.filePath, function (err, buffer) {
//             assert.equal(Buffer.compare(buffer, fileContent), 0, "Create/Write Test");
//         });
//     },

//     testAppendFile: function () {

//         fileManager.appendFile(this.filePath, contentToAppend, 3, function () {

//             fileManager.readFile(filePath, function (err, buffer) {

//                 const offset = 3;
//                 let firstPart = fileContent.slice(0, offset);
//                 let secondPart = Buffer.concat([contentToAppend,
//                     fileContent.slice(offset)]);
//                 let content = Buffer.concat([firstPart, secondPart]);

//                 console.log(content.toString(), 'FILE CONTENT');
//                 console.log(buffer.toString(), 'BUFFER');

//                 assert.true(Buffer.compare(buffer, fileContent), 0, "Append Test");
//             });
//         });
//     },

//     testOpen : function(){
//         fileManager.open(filePath, 'r', function( err, fd){
//             assert.notNull()
//         });
//     }
// });

// assert.callback(testName, function (callback) {
//     f.init(callback);
// }, 1000);