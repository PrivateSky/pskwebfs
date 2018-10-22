var Streamify = require("./lib/Streamify");

const prepareBrowserStreams = function (fs) {

    return {
        createReadStream: function (file, callback) {
            if(callback){
                fs.readFile(file, function(err,data){
                    var stream = Streamify(data);
                    callback(null, stream);
                });
            }
            else{
                var stream = null;
                var apiCalls = [];
                function executeCommands (){
                    apiCalls.forEach(function(call){
                        stream[call.handler].apply(stream,Array.from(call.args));
                    })
                }

                fs.readFile(file, function(err,data){
                    stream = Streamify(data);
                    executeCommands();
                });

                return {

                    on: function () {

                        if(stream){
                            stream['on'].apply(stream,Array.from(arguments));
                            return stream;
                        }
                        else{
                            apiCalls.push({
                                handler: "on",
                                name: name,
                                args: arguments
                            });
                            return this;
                        }


                    }

                }
            }

        },

        crateWriteStream:function(file){
            return {
                on:function(event){}
            }
        }
    }
};
module.exports = function (fs) {
    var browserStreams = prepareBrowserStreams(fs);
    for (var browserStream in browserStreams) {
        fs[browserStream] = browserStreams[browserStream];
    }
};