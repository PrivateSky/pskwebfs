var BrowserFS = require("browserfs-dist");
var browserFs = null;
var browserFsNamespace = {};
var asyncHandlers = ["appendFile", "readFile", "writeFile","open","read","close","appendFile","stat","fstat","unlink","mkdir","readdir","exists"];

var proxyFnHandlers = {
    asyncHandlers:asyncHandlers,
    syncHandlers:require("./lib/supplementaryFunctions")
};

function BrowserFsResolver() {

    var browserFsCalls = [];
    var browserFsWasResolved = false;

    this.onFSReady = function (fs) {
        for (let i = 0; i < browserFsCalls.length; i++) {
            let holder = browserFsCalls[i];
            fs[holder.name].apply(window, Array.from(holder.args))
        }

        if(typeof $$ !=="undefined" && $$.__runtimeModules){
            $$.__runtimeModules['fs'] = fs;
        }

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
                browserFs[name].apply(browserFs, Array.from(arguments));
            }
        }
    };
}

function installAndConfigureWebFS(callback) {
    BrowserFS.install(browserFsNamespace);
    BrowserFS.configure({
        fs: "MountableFileSystem",
        options: {
            "/": { fs: 'IndexedDB',options: {}},
        }
    }, function (e) {
        if (e) {
            throw e;
        }
        else {
            browserFs = BrowserFS.BFSRequire('fs');
            var supplementaryFunctions = require("./lib/supplementaryFunctions");

            for (var fn in supplementaryFunctions) {
                browserFs[fn] = supplementaryFunctions[fn];
            }

            callback(browserFs);
        }
    });

}

var browserFsResolver = new BrowserFsResolver();
installAndConfigureWebFS(browserFsResolver.onFSReady);


var handler = {
    get: function (target, name) {
        if (target.asyncHandlers.indexOf(name) !== -1) {
            return browserFsResolver.addProxifiedCall(name);
        }
        else if (target.syncHandlers.hasOwnProperty(name)) {
            return target.syncHandlers[name];
        }
        else {
            throw new Error("Method " + name + " does not exists.");
        }
    }
};

var proxyApi = new Proxy(proxyFnHandlers, handler);

if(typeof $$ !=="undefined" && $$.__runtimeModules){
    $$.__runtimeModules['fs'] = proxyApi;
}

module.exports = proxyApi;