function detectStrategy(){
    if(typeof window ==="object"){
        return "web";
    }
    else{
        return "node";
    }

}

module.exports = {
    detectStrategy:detectStrategy
}
