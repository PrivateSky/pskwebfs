var utilityFunctions = require ('../util/utilityFunctions');
var Strategy = require('./Strategy');


function AbstractFs(){

    const strategy = utilityFunctions.detectStrategy();
    const strategyFunctions = Strategy.getStrategyApis(strategy);

    
   for(strategyFn in strategyFunctions) {
        this[strategyFn] = strategyFunctions[strategyFn];
   }    


}

module.exports = new AbstractFs();