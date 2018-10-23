/**
 * https://www.npmjs.com/package/streamify-string
 * @type {*|Readable}
 */
const Readable = require('stream').Readable;
const util     = require('util');

function PSKFileReadableStream(filename, options) {

    if (! (this instanceof PSKFileReadableStream)) {
        return new PSKFileReadableStream(filename, options);
    }
    Readable.call(this, options);
    this.filename = filename;
    this.readStarted = false;

}

util.inherits(PSKFileReadableStream, Readable);

PSKFileReadableStream.prototype._read = function (size) {

    var self = this;

    function returnChunk() {

        var chunk = self.str.slice(0, size);
        if (chunk.length > 0) {
            self.str = self.str.slice(size);
            self.push(chunk);
        }
        else {
            self.push(null);
        }
    }

    if (!this.readStarted) {
        const fs = require("pskwebfs");
        this.readStarted = true;
        //http://localhost:52042/privatesky/modules/pskwebfs/tests/browserTests/sampleTest.html?_ijt=js5o3cuv5th71voas7dsfic56d
        fs.readFile(this.filename, (err, data) => {
            if (err) {
                this.emit("error",err);
                this.push(null);
                return;
            }
            this.str = data.toString();
            returnChunk();
        });
    } else {
        returnChunk();
    }
};

module.exports = PSKFileReadableStream;