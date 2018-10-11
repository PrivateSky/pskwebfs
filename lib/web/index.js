var BrowserFS = require("browserfs-dist");
var browserFs = null;
var proxyFnHandlers = ["appendFile", "readFile", "writeFile"];

function BrowserFsResolver() {

    var browserFsCalls = [];
    var browserFsWasResolved = false;

    this.resolve = function (fs) {

        for (var i = 0; i < browserFsCalls.length; i++) {
            var holder = browserFsCalls[i];
            fs[holder.name].apply(window, Array.from(holder.args))
        }
        $$.__runtimeModules['fs'] = fs;
        browserFsWasResolved = true;
        browserFsCalls = [];
    };

    this.addProxifiedCall = function (name) {
        return function () {
            if (browserFsWasResolved === false) {
                browserFsCalls.push({
                    name: name,
                    args: arguments
                });
            }
            else {
                browserFs[name].apply(window, Array.from(arguments));
            }
        }
    }
}


function installAndConfigureWebFS(fsResolver) {

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
            browserFs = BrowserFS.BFSRequire('fs');
            fsResolver.resolve(browserFs);
        }
    });

}

var browserFsResolver = new BrowserFsResolver();
installAndConfigureWebFS(browserFsResolver);


var handler = {
    get: function (target, name) {
        if (target.indexOf(name) !== -1) {
            return browserFsResolver.addProxifiedCall(name);
        }
        else {
            throw new Error("Method " + name + " does not exists.");
        }
    }
};

var proxyApi = new Proxy(proxyFnHandlers, handler);

$$.__runtimeModules['fs'] = proxyApi;
module.exports = proxyApi;