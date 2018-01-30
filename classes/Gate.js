const Currency = require("./Currency.js");
const fetch = require("node-fetch");

module.exports = class Gate {
    
    constructor(){
        this.name = "Gate";
        this.data;

        this.withdrawFees = {
            "USDT": 28.5,
            "ETH": 0.01,
            "NEO": 0,
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
        };
    }

    async loadData(){
        const response = await fetch("https://data.gate.io/api2/1/tickers");
        this.data = await response.json();
        return this.data;
    }

    getCoin(currency, inCurrency = "USDT") {
        if(currency == "XRP" || currency == "WAVES"){
            return null;
        }

        try {   
            //check if value exists in USDT
            var data = this.data[`${currency.toLowerCase()}_${inCurrency.toLowerCase()}`];
    
            var c = new Currency(currency, data.lowestAsk, data.highestBid);
            return c;
    
        } catch (error) {
            var g= true;
        }
    };
    
};