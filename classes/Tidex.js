const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Tidex {
    
    constructor(cryptoList){
        this.data;
        this.cryptoList = cryptoList;

        this.withdrawFees = {
            "USDT": 10,
            "ETH": 0.01,
            "WAVES": 0.01,
            "LTC": 0.001,
            "DASH": 0.01,
            "TRX": 100,
            "EOS": 1
        };
    }

    async loadData(){
        var pairs = "";
        
        for(var c in this.cryptoList){
            pairs += this.cryptoList[c].toLowerCase() + "_usdt-";
        }
    
        for(var c in this.cryptoList){
            pairs += this.cryptoList[c].toLowerCase() + "_eth-";
        }
    
        for(var c in this.cryptoList){
            pairs += this.cryptoList[c].toLowerCase() + "_btc-";
        }
        
        const response = await fetch(`https://api.tidex.com/api/3/ticker/${pairs}?ignore_invalid=1`);
        this.data = await response.json();

        return this.data;
    }

    getCoin(currency, inCurrency = "USDT") {
        try {   
            inCurrency = inCurrency.toLowerCase();
            var pair = currency.toLowerCase() + "_" + inCurrency;

            //check if value exists in USDT
            if(this.data[pair] != undefined){
                var data =  this.data[pair];
    
                var c = new Currency(currency, data.sell, data.buy);
                return c;
            }
    
        } catch (error) {
          //console.log(error);
        }
    };
    
};