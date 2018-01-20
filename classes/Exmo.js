const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Exmo {

    constructor(){
        this.data;
        this.withdrawFees = {
            "USDT": 28.5,
            "ETH": 0.01,
            "XRP": 0.02,
            "WAVES": 0.001,
            "LTC": 0.01,
            "ZEC": 0.001,
            "DASH": 0.001,
            "ETC": 0.01,
            "XMR": 0.05,
            "BCH": 0.001
        };
    }

    async loadData(){
        const response = await fetch("https://api.exmo.com/v1/ticker/");
        this.data = await response.json();
        
        return this.data;
    }

    getCoin(currency) {
        try {
            var c = new Currency();
    
            if(this.data[currency.toUpperCase() + "_USD"] != undefined){
                var data = this.data[currency.toUpperCase() + "_USD"];
                
                c.buyPrice = data.buy_price;
                c.sellPrice = data.sell_price;
                c.currencyName = currency; 
    
                return c;
            } else {
                var currInBtc = JSON.parse(JSON.stringify(this.data[currency.toUpperCase() + "_BTC"]));
                var btcPrice = JSON.parse(JSON.stringify(this.data["BTC_USD"]));
    
                currInBtc.buy_price = currInBtc.buy_price * btcPrice.buy_price;
                currInBtc.sell_price = currInBtc.sell_price * btcPrice.sell_price;
    
                c.buyPrice = currInBtc.buy_price;
                c.sellPrice = currInBtc.sell_price;
                c.currencyName = currency; 
    
                return c;
            } 
        } catch (error) {
            //console.log(error);
        }
    };


};