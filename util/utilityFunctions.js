function detectStrategy(){
    if(module.exports === "undefined" && typeof window ==="object"){
        return "web";
    }
    else{
        return "node";
    }

}

module.exports = {
    detectStrategy:detectStrategy
}
