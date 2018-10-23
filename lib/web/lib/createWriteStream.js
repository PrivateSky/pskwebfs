const WritableStream = require("./PSKFileWritableStream");

function createWriteStream(fs){
    return function (file, callback) {
        if(callback){
             var stream = WritableStream(file);
             callback(null, stream);
        }
        else{
            console.log("esas");
        }
    }
}


module.exports.createWriteStream = function (fs) {
    return createWriteStream(fs);
};