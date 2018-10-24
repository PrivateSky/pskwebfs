const prepareBrowserStreams = function (fs) {

    return {
        createReadStream: require("./lib/PSKFileReadableStream"),
        createWriteStream: require("./lib/PSKFileWritableStream")
    }
};
module.exports = function (fs) {
    var browserStreams = prepareBrowserStreams(fs);
    for (var browserStream in browserStreams) {
        fs[browserStream] = browserStreams[browserStream];
    }
};