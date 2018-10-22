var BrowserFS = require("browserfs-dist");
var browserFs = null;
var asyncHandlers = ["appendFile", "readFile", "writeFile"];
var fakeStreamsHandlers = ["createReadStream"];

var proxyFnHandlers = {
    asyncHandlers:asyncHandlers,
    syncHandlers:fakeStreamsHandlers
};


function BrowserFsResolver() {

    var browserFsCalls = [];
    var pendingCalls = [];
    var browserFsWasResolved = false;

    this.onFSReady = function (fs) {
        for (let i = 0; i < browserFsCalls.length; i++) {
            let holder = browserFsCalls[i];
            fs[holder.name].apply(window, Array.from(holder.args))
        }
        $$.__runtimeModules['fs'] = fs;
        browserFsWasResolved = true;
        browserFsCalls = [];

        pendingCalls.forEach(function(command){
            executeCommandCalls(fs, command);
        });
        pendingCalls = [];

    };

    function executeCommandCalls(fs, command) {
        console.log(command);
        fs[command.streamApi].call(window, command.file, function (err, stream) {
            if (!err) {
                for (let j = 0; j < command.apiCalls.length; j++) {
                    let commandCall = command.apiCalls[j];
                    stream[command.apiCalls[j].handler].apply(stream, Array.from(commandCall.args));

                }
            }
        })
    }

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
    };

    this.addPendingCall = function (name) {
        return function (file) {


            if (browserFsWasResolved === false) {
                var pendingCall = {
                    streamApi: name,
                    file: file,
                    apiCalls: []
                };

                return {
                    on: function () {

                        pendingCall.apiCalls.push({
                            handler: "on",
                            name: name,
                            args: arguments
                        });


                        if (browserFs) {
                            executeCommandCalls(browserFs, pendingCall);
                        } else {
                            if (!containsObject(pendingCall, pendingCalls)) {
                                pendingCalls.push(pendingCall);
                            }
                        }



                        return this;
                    }
                }
            }
            else {
                var stream = null;
                var apiCalls = [];
                function executeCommands (){
                   apiCalls.forEach(function(call){
                       stream[call.handler].apply(stream,Array.from(call.args));
                   })
                }

                browserFs[name].call(window, file, function (err, fileStream) {
                    stream = fileStream;
                    executeCommands()
                });

                return {
                    on: function () {
                        apiCalls.push({
                            handler: "on",
                            name: name,
                            args: arguments
                        });
                        return stream ? stream : this;
                    }

                }


            }
        }
    }

}

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

function installAndConfigureWebFS(callback) {

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
            var streamLoader = require("./streamLoader");
            streamLoader(browserFs);
            console.log(browserFs);
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
        else if (target.syncHandlers.indexOf(name) !== -1) {
            return browserFsResolver.addPendingCall(name);
        }
        else {
            throw new Error("Method " + name + " does not exists.");
        }
    }
};

var proxyApi = new Proxy(proxyFnHandlers, handler);

$$.__runtimeModules['fs'] = proxyApi;
module.exports = proxyApi;