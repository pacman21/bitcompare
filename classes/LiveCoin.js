const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class LiveCoin {
    
    constructor(){
        this.name = "LiveCoin";
        this.data;
        this.withdrawFees = {
            "USDT": 28.5,
            "ETH": 0.01,
            "NEO": 0,
            "WAVES": 0.01,
            "QTUM": 0.1,
            "LTC": 0.01,
            "EOS": 0.01,
            "DASH": 0.002,
            "LSK": 0.2,
            "XMR": 0.03,
            "Wings": 0.01,
            "ICN": 1,
            "MCO": 0.6,
            "MTL": 2,
            "RLC": 3
        }
    }

    async loadData(){
        const response = await fetch("https://api.livecoin.net/exchange/ticker");
        this.data = await response.json();
        return this.data;
    }

    getCoin(currency, inCurrency = "USD") {
        try {
            if(currency == "BCC"){
                return;
            }

            var item = this.data.filter(function(item) {
                return item.symbol == currency.toUpperCase() + `/${inCurrency.toUpperCase()}`;
            }); 
    
            if(item.length > 0){
                var data = item[0]; 
                var c = new Currency(currency, data.best_ask, data.best_bid);
                return c;
            } /*else {
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
            }   */

        } catch (error) {
          var g = true;
        }
    };
};