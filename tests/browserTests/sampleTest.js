const fs = require("fs");

/*fs.appendFile("/indexed/text.txt", "Salut din IndexedDB\n", function (err,response) {
    fs.readFile("/indexed/text.txt",function(err, contents){
        console.log(contents.toString());
    })
});*/

setTimeout(function(){

    var readStream = fs.createReadStream("/indexed/text.txt");
    readStream
        .on('data', function (chunk) {
            console.log(chunk.toString());
        })
        .on('end', function () {
            console.log("END");
        }).on('end',function(){
            console.log("end2")
    });
},2000);


    var readStream = fs.createReadStream("/indexed/text.txt");
    readStream
        .on('data', function (chunk) {
            console.log(chunk.toString());
        })
        .on('end', function () {
            console.log("END");
        });


setTimeout(function(){
    const fs2 = require("fs");
    var readStream = fs2.createReadStream("/indexed/text.txt");

    setTimeout(function(){
        readStream
            .on('data', function (chunk) {
                console.log(chunk.toString());
            })
    },1000);
    readStream
        .on('end', function () {
            console.log("END");
        }).on('end',function(){
        console.log("end2")
    });
},1400);





