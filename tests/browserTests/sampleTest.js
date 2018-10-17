const fs = require("fs");

fs.appendFile("/indexed/text.txt", "Salut din IndexedDB\n", function (err,response) {
    fs.readFile("/indexed/text.txt",function(err, contents){
        console.log(contents.toString());
    })
});

setTimeout(function(){
    const fs = require("fs");
    var readStream = fs.createReadStream("/indexed/text.txt");
    console.log(readStream);
    readStream
        .on('data', function (err, chunk) {
            console.log(chunk.toString());
        })
        .on('end', function () {
            console.log("end");
        });
},1200);




