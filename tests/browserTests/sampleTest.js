const fs = require("fs");
const assert = require("assert");


/*fs.readFile("/indexed/text.txt",function(err, contents){
    console.log(contents.toString());
})*/

/*fs.appendFile("/indexed/text.txt", "Salut din IndexedDB\n", function (err,response) {
    fs.readFile("/indexed/text.txt",function(err, contents){
        console.log(contents.toString());
    })
});*/



/*var readStream = fs.createReadStream("/isndexed/text.txt");
readStream
    .on('data', function (chunk) {
        console.log(chunk.toString());
    })
    .on('end', function () {
        console.log("END");
    }).on('error',function(err){
        console.log("On error",err);
});
*/

/*var readStream = fs.createReadStream("/indexed/text.txt");
readStream
    .on('data', function (chunk) {
        console.log(chunk.toString());
    })
    .on('end', function () {
        console.log("END");
    });




fs.open("/indexed/text.txt", "r+", function (error, fd) {

    var contentOfValidFile = "TralalaRafaelR"
    if (error) throw error;
    var buffer = new Buffer(14);
    fs.read(fd, buffer, 0, buffer.length, null, function (error, bytesRead, buffer) {
        assert.equal(error, null, 'TEST FAILED: err not null');
        assert.equal(bytesRead, 14, 'TEST FAILED - READ - no of bytes');
        var data = buffer.toString("utf8");
        assert.equal(data, contentOfValidFile, 'TEST FAILED: read');
    });

    fs.close(fd, function (err) { });
});
*/



var writeStream = fs.createWriteStream("/indexed/text.txt");
writeStream.write("Tralala");
writeStream.on('finish', () => {
    console.log('wrote all data to file');
});
writeStream.end("Mastaleru");
writeStream.write("Rafael");

/*setTimeout(function(){
    const fs2 = require("fs");
    var readStream = fs2.createReadStream("/indexed/text.txt");

    setTimeout(function(){
        var s = readStream
            .on('data', function (chunk) {
                console.log(chunk.toString());
            });
        console.log(s);
    },1000);
    readStream
        .on('end', function () {
            console.log("END");
        }).on('end',function(){
        console.log("end2")
    });
},1400);*/





