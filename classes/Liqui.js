const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Exx {
    
    constructor(cryptoList){
        this.data;
        this.cryptoList = cryptoList;

        this.withdrawFees = {
            "USDT": 28.5,
            "ETH": 0.01,
            "NEO": 0,
            "XRP": 0.25,
            "WAVES": 0.02,
            "QTUM": 0.01,
            "LTC": 0.01,
            "EOS": 1,
            "ZEC": 0.01,
            "DASH": 0.002,
            "ETC": 0.01,
            "LSK": 0.1,
            "XMR": 0.04,
            "Wings": 10.1,
            "KMD": 0.002,
            "ICN": 4,
            "MCO": 0.89,
            "MTL": 2.6,
            "RLC": 5.2,
            "BCH": 0.001,
            "BCC": 0.001,
            "ADA": 1
        };
    }

    async loadData(){
        var pairs = "";
        
        for(var c in cryptoList){
            pairs += cryptoList[c].toLowerCase() + "_usdt-";
        }
        
        const response = await fetch(`https://api.liqui.io/api/3/ticker/${pairs}?ignore_invalid=1`);
        this.data = await response.json();
        return this.data;
    }

    getCoin(currency, inCurrency = "usdt") {
        try {   
            var currKey = `${currency.toLowerCase()}_${inCurrency}`;
            //check if value exists in USDT
            if(this.data[currKey] != undefined){
                var data =  this.data[currKey];
    
                if(data.buy > 0 && data.sell > 0){
                    var c = new Currency(currency, data.sell, data.buy);
                    return c;
                }
            }
    
        } catch (error) {
          //console.log(error);
        }
    }
};