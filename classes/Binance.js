const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Binance{

    constructor(){
        this.data;
    }
    async loadData(){
        if(typeof(this.data) == "undefined") {    
            const response = await fetch("https://api.binance.com/api/v1/ticker/allPrices");
            this.data = await response.json();
            return this.data;
        }
    }

    getCoin(outCurrency, inCurrency = "USDT") {
        try {  
            if(outCurrency == "USDT"){
                return 1;
            }     

            //check if value exists in USDT
            var item = this.data.filter(function(item) {
                return item.symbol == outCurrency.toUpperCase() + inCurrency;
            }); 

            if(item.length > 0){
                var data = item[0].price;

                var c = new Currency(outCurrency, data, data);
                return c;
            } else {
                var etherItem = this.data.filter(function(item) {
                    return item.symbol == "ETHUSDT";
                });      
                
                var etherPrice = etherItem[0].price;

                var valueEth = this.data.filter(function(item) {
                    return item.symbol == outCurrency.toUpperCase() + "ETH";
                });

                if(valueEth.length > 0){
                    var data = valueEth[0].price * etherPrice;
                    var c = new Currency(outCurrency, data, data);

                    return c;
                }
            }

        } catch (error) {
            console.log(error);
        }
    };
}