
const prepareBrowserStreams = function (fs) {

    return {
        createReadStream: require("./lib/createReadStream").createReadStream(fs),

        createWriteStream:require("./lib/createWriteStream").createWriteStream(fs)
    }
};
module.exports = function (fs) {
    var browserStreams = prepareBrowserStreams(fs);
    for (var browserStream in browserStreams) {
        fs[browserStream] = browserStreams[browserStream];
    }
};