var utilityFunctions = require('../util/utilityFunctions');
var webStrategy = require('./web/index');
var nodeStrategy = require('./node/index');
var customStrategy = require('./custom/index');

var strategyApis = {};

function registerStrategy(strategy, fsFunctions) {

    /*
    TODO
    verify if fsFunctions contains valid declarations
    */

    if (strategyApis[strategy]) {
        console.log("Overwritting strategy ", strategy);
    }

    strategyApis[strategy] = fsFunctions;

}

function getStrategyApis(strategy) {
    if (strategyApis[strategy]) {
        return strategyApis[strategy];
    }
    else {
        throw new Error("Strategy " + strategy + " was not found");
    }
}

var strategy = utilityFunctions.detectStrategy();
console.log(strategy);
switch (strategy) {
    case "web":
        registerStrategy("web", webStrategy);
        break;
    case "node":
        registerStrategy("node", nodeStrategy);
        break;
    default:
        registerStrategy("custom", customStrategy);
}


module.exports = {
    getStrategyApis: getStrategyApis
};