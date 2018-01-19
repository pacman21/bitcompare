

function getKucoin(outCurrency, inCurrency = "USDT") {
    try {  
        //check if value exists in USDT
        var item = kucoinData.filter(function(item) {
            return item.symbol == outCurrency.toUpperCase() + "-" + inCurrency;
        }); 

        if(item.length > 0){
            var c = new Currency(outCurrency, item[0].sell, item[0].buy);
            return c;
        } else {
            var etherItem = kucoinData.filter(function(item) {
                return item.symbol == "ETH-USDT";
            });      
            
            var etherSell = etherItem[0].sell;
            var etherBuy = etherItem[0].buy;

            var valueEth = kucoinData.filter(function(item) {
                return item.symbol == outCurrency.toUpperCase() + "-ETH";
            });

            if(valueEth.length > 0){
                var c = new Currency(outCurrency, valueEth[0].sell * etherSell, valueEth[0].buy * etherBuy);

                return c;
            }
        }

    } catch (error) {
      //console.log(error);
    }
};

function getLiqui(currency) {
    try {   
        //check if value exists in USDT
        if(liquiData[currency.toLowerCase() + "_usdt"] != undefined){
            var data =  liquiData[currency.toLowerCase() + "_usdt"];

            if(data.buy > 0 && data.sell > 0){
                var c = new Currency(currency, data.buy, data.sell);
                return c;
            }
        }

    } catch (error) {
      //console.log(error);
    }
};

function getGate(currency) {
    try {   
        //check if value exists in USDT
        if(gateData[currency.toLowerCase() + "_usdt"] != undefined){
            var data =  gateData[currency.toLowerCase() + "_usdt"];

            var c = new Currency(currency, data.lowestAsk, data.highestBid);
            return c;
        }

    } catch (error) {
      //console.log(error);
    }
};


function getWex(currency) {
    try {   
        //check if value exists in USDT
        if(wexData[currency.toLowerCase() + "_usd"] != undefined){
            var data =  wexData[currency.toLowerCase() + "_usd"];

            var c = new Currency(currency, data.sell, data.buy);
            return c;
        }

    } catch (error) {
      //console.log(error);
    }
};

function getYoBit(currency) {
    try {   
        //check if value exists in USDT
        if(yoBitData[currency.toLowerCase() + "_usd"] != undefined){
            var data =  yoBitData[currency.toLowerCase() + "_usd"];

            var c = new Currency(currency, data.sell, data.buy);
            return c;
        }

    } catch (error) {
      //console.log(error);
    }
};

function getCoinExchange(currency){
    try {
        var item = coinExchangeData.filter(function(item) {
            return item["Symbol"] == currency.toUpperCase() + "/BTC";
        }); 

        if(item.length > 0){
            var c = new Currency(currency, item[0]["AskPrice"], item[0]["BidPrice"]);
            return c;
        }
    } catch(err){
        var g = true;
    }
}

async function getLiveCoinData(){
    const response = await fetch("https://api.livecoin.net/exchange/ticker");
    return await response.json();
}

async function getGateData(){
    const response = await fetch("https://data.gate.io/api2/1/tickers");
    return await response.json();
}

async function getKucoinData(){
    const response = await fetch("https://api.kucoin.com/v1/open/tick");
    return (await response.json()).data;
}

async function getCoinExchangeData(){
    const response = await fetch("https://www.coinexchange.io/api/v1/getmarkets");
    var markets = (await response.json()).result;

    const summariesResponse = await fetch("https://www.coinexchange.io/api/v1/getmarketsummaries");
    var summaries = (await summariesResponse.json()).result;

    var newData = [];

    for(var i = 0; i < markets.length; i++){
        var market = markets[i];
        
        if(market.BaseCurrencyCode == "BTC") {
            newData[market.MarketID] = [];
            newData[market.MarketID]["Symbol"] = market.MarketAssetCode + "/" + market.BaseCurrencyCode;
        }
    }

    for(var i = 0; i < summaries.length; i++){
        var summary = summaries[i];
        var marketId = summary.MarketID

        
        if(typeof newData[marketId] == "undefined"){
            var g = true;
        } else {
            newData[marketId]["BidPrice"] = summary.BidPrice;
            newData[marketId]["AskPrice"] = summary.AskPrice;
        }
    }

    return newData;
}

async function getWexData(){
    var pairs = "";
    
    for(var c in cryptoList){
        pairs += cryptoList[c].toLowerCase() + "_usd-";
    }

    for(var c in cryptoList){
        pairs += cryptoList[c].toLowerCase() + "_eth-";
    }

    for(var c in cryptoList){
        pairs += cryptoList[c].toLowerCase() + "_btc-";
    }
    
    const response = await fetch(`https://wex.nz/api/3/ticker/${pairs}?ignore_invalid=1`);
    return await response.json();
}

async function getLiquiData(){
    var pairs = "";
    
    for(var c in cryptoList){
        pairs += cryptoList[c].toLowerCase() + "_usdt-";
    }
    
    const response = await fetch(`https://api.liqui.io/api/3/ticker/${pairs}?ignore_invalid=1`);
    return await response.json();
}

async function getYoBitData(){
    var pairs = "";
    
    for(var c in cryptoList){
        pairs += cryptoList[c].toLowerCase() + "_usd-";
    }
    
    const response = await fetch(`https://yobit.net/api/3/ticker/${pairs}?ignore_invalid=1`);
    return await response.json();
}