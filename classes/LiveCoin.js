const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class LiveCoin {
    
    constructor(){
        this.data;
    }

    async loadData(){
        const response = await fetch("https://api.livecoin.net/exchange/ticker");
        this.data = await response.json();
        return this.data;
    }

    getCoin(currency, inCurrency = "USD") {
        try {
            var item = this.data.filter(function(item) {
                return item.symbol == currency.toUpperCase() + `/${inCurrency}`;
            }); 
    
            if(item.length > 0){
                var data = item[0]; 
                var c = new Currency(currency, data.best_ask, data.best_bid);
                return c;
            } else {
                var currInBtc = this.data.filter(function(item) {
                    return item.symbol == currency.toUpperCase() + "/BTC";
                }); 
    
                var btcPrice = this.data.filter(function(item) {
                    return item.symbol == "BTC/USD";
                }); 
    
                var btcCurr = JSON.parse(JSON.stringify(currInBtc[0]));
                var btcUSDPrice = JSON.parse(JSON.stringify(btcPrice[0]));
    
                btcCurr.best_ask *= btcUSDPrice.best_ask;
                btcCurr.best_bid *= btcUSDPrice.best_bid;
    
                var c = new Currency(currency, btcCurr.best_ask, btcCurr.best_bid);
                
                return c;
            }        
        } catch (error) {
          var g = true;
        }
    };
};