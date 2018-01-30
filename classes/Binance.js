const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Binance{

    constructor(){
        this.name = "Binance";
        
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
            "ZEC": 0.005,
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
        if(typeof(this.data) == "undefined") {    
            const response = await fetch("https://api.binance.com/api/v1/ticker/allPrices");
            this.data = await response.json();
            return this.data;
        }
    }

    getCoin(outCurrency, inCurrency = "USDT") {
        try {  
            var outCurrency = outCurrency.toUpperCase();
            var tradeOutcurrency = outCurrency;

            if(outCurrency.toUpperCase() == "USDT"){
                return 1;
            }     

            if(outCurrency == "BCH"){
                tradeOutcurrency = "BCC";
            }

            //check if value exists in USDT
            var item = this.data.filter(function(item) {
                return item.symbol == tradeOutcurrency.toUpperCase() + inCurrency.toUpperCase();
            }); 

            if(item.length > 0){
                var data = item[0].price;

                var c = new Currency(outCurrency, data, data);
                return c;
            } 
            
            if(inCurrency == "USDT") {
                var etherItem = this.data.filter(function(item) {
                    return item.symbol == "ETHUSDT";
                });      
                
                var etherPrice = etherItem[0].price;

                var valueEth = this.data.filter(function(item) {
                    return item.symbol == tradeOutcurrency.toUpperCase() + "ETH";
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