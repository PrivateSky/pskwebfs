const PSKFileReadableStream = require("./PSKFileReadableStream");
function createReadStream (fs){
    return function(file, callback) {


        var stream = PSKFileReadableStream(file);

        if (callback) {
            callback(null, stream);
        }
        return stream;

    }
}


module.exports.createReadStream = function(fs){
    return createReadStream(fs);
};