const BrowserFS = require("./browserfs");

function installAndConfigureWebFS() {
    return new Promise(function (resolve) {
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
                resolve();
            }
        });
    });
}

module.exports = BrowserFS;