/**
 * https://www.npmjs.com/package/streamify-string
 * @type {*|Readable}
 */
const Readable = require('stream').Readable;
const util     = require('util');
const Buffer = require('buffer').Buffer;

function PSKFileReadableStream(filename, options) {
    if (! (this instanceof PSKFileReadableStream)) {
        return new PSKFileReadableStream(filename, options);
    }
    Readable.call(this, options);
    this.filename = filename;
    if(options){
        this.options = options;
    }
    this.readStarted = false;

}

util.inherits(PSKFileReadableStream, Readable);


//TODO handle fs flags in options!!!!!
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
        fs.readFile(this.filename, (err, data) => {
            if (err) {
                this.emit("error",err);
                this.push(null);
                return;
            }
            this.str = data;

            if (typeof this.options === "object") {

                if(this.options.hasOwnProperty("start") || this.options.hasOwnProperty("end")){

                    if (this.options.hasOwnProperty("start") && typeof(this.options.start) !== "number") {
                        throw new TypeError('"start" option must be a Number');
                    }

                    if (this.options.hasOwnProperty("end") && typeof(this.options.end) !== "number") {
                        throw new TypeError('"end" option must be a Number');
                    }

                    if (this.options.start>=0 && this.options.end>=0) {
                        if (this.options.start > this.options.end) {
                            throw new Error('"start" option must be <= "end" option');
                        }
                        else {
                            this.str = this.str.slice(this.options.start, this.options.end+1);
                        }
                    } else if (this.options.start) {
                        this.str = this.str.slice(this.options.start);
                    }
                    else {
                        this.str = this.str.slice(0, this.options.end+1);
                    }
                }

            }else{
                if(typeof this.options === "string"){
                    this.str = new Buffer(this.str).toString(this.options);
                }
            }
            returnChunk();
        });
    } else {
        returnChunk();
    }
};

module.exports = PSKFileReadableStream;