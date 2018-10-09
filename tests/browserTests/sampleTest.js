const fs = require("fs");

fs.appendFile("/indexed/text.txt", "Salut din IndexedDB\n", function (err,response) {
    fs.readFile("/indexed/text.txt",function(err, contents){
        console.log(contents.toString());
    })
});




