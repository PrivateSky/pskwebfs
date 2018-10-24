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

PSKFileWritableStream.prototype._write = function (data) {
    console.log(data);
    fs.appendFile(this.file, data.toString(),  (err,response) => {
        //console.log(this.write(data));
    });
};


var nativeEnd = PSKFileWritableStream.prototype.end;

PSKFileWritableStream.prototype.end = function(chunk, encoding, cb){

this.write.apply(this,Array.from(arguments));
this.emit("end");

};

module.exports = PSKFileWritableStream;