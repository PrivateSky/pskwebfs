var BrowserFS = require("browserfs");
var browserFsIsInitalized = false;
var browserFs = null;
function installAndConfigureWebFS() {

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
                browserFsIsInitalized = true;
                browserFs = BrowserFS.BFSRequire('fs');
                resolveProxy(browserFs);
            }
        });

}
installAndConfigureWebFS();


function  resolveProxy(fs){
    $$.__runtimeModules['fs'] = fs;
    for(var fsFn in proxiesCalls){
        while(proxiesCalls[fsFn].length>0){
            var args = proxiesCalls[fsFn].pop();
            fs[fsFn].apply(window, Array.from(args));
        }
    }
}

var proxyFnHandlers = ["appendFile","readFile"];
var proxiesCalls = {};
var proxyFS  = {};

proxyFnHandlers.forEach(function(proxyFnName){

    proxyFS[proxyFnName] = function(){

        if(browserFsIsInitalized === false){
            if(!proxiesCalls[proxyFnName]){
                proxiesCalls[proxyFnName] = [];
            }
            proxiesCalls[proxyFnName].push(arguments);
        }
        else{
            browserFs[proxyFnName].apply(window,Array.from(arguments));
        }
    }
});


var handler = {
    proxiesCalls : [],
    set:function(target, property){
        this.proxiesCalls.push({
            name:property,
            callback:function(){
                /*if(browserFsIsInitalized === false){
                    proxiesCalls[proxyFnName].push(arguments);
                }
                else{
                    property.apply(window,Array.from(arguments));
                }*/
            }
        })
    },
    get:function(target, name){
        if(name in target){
            return target[name];
        }
        else{
            throw new Error("Method "+name+" does not exists.");
        }
    }
};

var proxyApi = new Proxy(proxyFnHandlers, handler);
console.log(proxyApi);

$$.__runtimeModules['fs'] = proxyFS;
module.exports = proxyFS;