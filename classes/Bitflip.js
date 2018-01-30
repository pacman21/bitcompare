const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Bitflip {
    
    constructor(){
        this.name = "Bitflip";
        
        this.data;

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
        const response = await fetch(`https://api.bitflip.cc/method/market.getRates`);
        this.data = (await response.json())[1];
        return this.data;
    }

    getCoin(currency, inCurrency = "USD") {
        try {   
            var item = this.data.filter(function(item) {
                return item.pair == `${currency.toUpperCase()}:${inCurrency.toUpperCase()}`;
            }); 

            if(item.length > 0){
                var data = item[0];

                var c = new Currency(currency, data.sell, data.buy);
                return c;
            }
    
        } catch (error) {
          //console.log(error);
        }
    }
};