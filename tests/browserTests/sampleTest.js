const BrowserFS = require("pskwebfs");

BrowserFS.install(window);
BrowserFS.configure({
    fs: "MountableFileSystem",
    options: {
        "/memory": {fs: "InMemory"},
        "/local": {fs: "LocalStorage"},
        "/indexed": {fs: "IndexedDB", options: {}}
    }
}, function (e) {
    if (e) {
        throw e;
    }
    else {
        const fs = require("fs");

        fs.appendFile("/indexed/text.txt", "Salut din IndexedDB\n", function (err,response) {
            fs.readFile("/indexed/text.txt",function(err, contents){
                console.log(contents.toString());
            })
        });
    }
});






