var functionUndefined = function(){
    throw new Error ("Not implemented for node");
}
module.exports = {
    stat:functionUndefined,
    writeFile:functionUndefined,
    readFile:functionUndefined,
    createWriteStream:functionUndefined,
    createReadStream:functionUndefined,
    open:functionUndefined,
    close:functionUndefined,
    fstat:functionUndefined,
    readDir:functionUndefined,
    statSync:functionUndefined,
    writeFileSync:functionUndefined,
    readFileSync:functionUndefined,
    existsSync:functionUndefined,
    mkdirSync:functionUndefined,
    unlinkSync:functionUndefined,
    rmdirSync:functionUndefined
};