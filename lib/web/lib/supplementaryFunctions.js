module.exports = {
    createReadStream: require("./PSKFileReadableStream"),
    createWriteStream: require("./PSKFileWritableStream"),
    access:function(path, callback){
        var fs = require("pskwebfs");
        fs.stat(path,callback);
    }
};