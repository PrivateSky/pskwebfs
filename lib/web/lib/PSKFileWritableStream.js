const Writable = require('stream').Writable;
const util     = require('util');
var Buffer = require("buffer").Buffer;

function PSKFileWritableStream(file, options) {

    if (! (this instanceof PSKFileWritableStream)) {
        return new PSKFileWritableStream(file, options);
    }

    Writable.call(this, options);
    this.file = file;
    var buffer = Buffer.from("");
    var self = this;
    var isOpened = true;

    this.write = function(data){
        if(isOpened){
            buffer = Buffer.concat([buffer,Buffer.from(data)]);
        }
        else{
            self.emit("error", new Error("Stream is closed"));
        }

    };

    this.end = function (chunk, encoding, cb) {
        isOpened = false;
        if (typeof encoding === "function") {
            cb = encoding;
            encoding = "utf-8";
        }

        if (typeof  chunk === "function") {
            cb = chunk;
            chunk = null;
        }

        if(typeof options === "string"){
            encoding = options;
        }

        if(chunk){
            buffer=Buffer.concat([buffer,Buffer.from(chunk)]);
        }

        var fs = require("pskwebfs");
        fs.writeFile(file, buffer, {encoding: encoding}, function (err, res) {
            if (err) {
                self.emit("error", err);
            }
            else {
                self.emit("finish");
            }
            if (cb) {
                cb(err, res);
            }

        })
    }
}

util.inherits(PSKFileWritableStream, Writable);
module.exports = PSKFileWritableStream;