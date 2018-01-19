const Currency = require('./classes/Currency.js');
const Binance = require('./classes/Binance.js');
const Exmo = require('./classes/Exmo.js');
const LiveCoin = require('./classes/LiveCoin.js');
var fs = require('fs');
var sleep = require('sleep');

var highestBuyDiff = [];
var leastSellDiff = [];
var highestBuyDiffCoin = [];
var leastSellDiffCoin = [];
var binance = new Binance();
var exmo = new Exmo();
var liveCoin = new LiveCoin();

function compare(coin){
    var binanceCurr = 1;

    console.log(coin);

    binanceCurr = binance.getCoin(coin);
    console.log("Binance Price: " + binanceCurr.buyPrice);

    for (var i = 0; i < exchangeList.length; i++) {
        try {
            var exchange = exchangeList[i];
            var exchangeCoin = new Currency();

            if(exchange == "Exmo"){
                exchangeCoin = exmo.getCoin(coin);
            } else if(exchange == "LiveCoin") {
                exchangeCoin = liveCoin.getCoin(coin);
            }

            var bToE = (exchangeCoin.sellPrice - binanceCurr.sellPrice) /binanceCurr.sellPrice;
            var eToB = (exchangeCoin.buyPrice - binanceCurr.buyPrice) / exchangeCoin.buyPrice;
            
            if(bToE > highestBuyDiff[exchange]){
                highestBuyDiff[exchange] = bToE;
                highestBuyDiffCoin[exchange] = coin;
            }

            if(eToB < leastSellDiff[exchange]){
                leastSellDiff[exchange] = eToB;
                leastSellDiffCoin[exchange] = coin;
            }

            console.log(`${exchange} Buy Price: ${exchangeCoin.buyPrice} --- ${exchange} Sell Price: ${exchangeCoin.sellPrice}`);        
            console.log(`${exchangeCoin.currencyName} -- Binance to ${exchange}: ${bToE}`);
            console.log(`${exchangeCoin.currencyName} -- ${exchange} to Binance: ${eToB}`);
        } catch(ex){
            //console.log(ex);
        }
    }

    console.log("\n\n");
}


function estimateEarnings(startCoin, middleCoin, investment, exchange, minimalOutput = false){
    try {
        var binanceStartCoinPrice = binance.getCoin(startCoin).buyPrice;
        var binanceMiddleCoinPrice = binance.getCoin(middleCoin).sellPrice;
        var exchangeStartCoin;    
        var exchangeMiddleCoin;
        var exchangeWithdrawFees;

        switch(exchange){
            case "Exmo":
                exchangeStartCoin = exmo.getCoin(startCoin);    
                exchangeMiddleCoin = exmo.getCoin(middleCoin);
                exchangeWithdrawFees = exmoWithdrawFees;
                break;
            case "LiveCoin":
                exchangeStartCoin = liveCoin.getCoin(startCoin);    
                exchangeMiddleCoin = liveCoin.getCoin(middleCoin);
                exchangeWithdrawFees = liveCoinWithdrawFees;
                break;
        }

        var exchangeStartCoinPrice = exchangeStartCoin.sellPrice;
        var echangeMiddleCoinPrice = exchangeMiddleCoin.buyPrice;
        
        var buySC = (investment * 0.99) / binanceStartCoinPrice;
        var receiveSC = buySC - binanceWithdrawFees[startCoin];
        var sellSC = receiveSC * exchangeStartCoinPrice;
        var buyMC = sellSC / echangeMiddleCoinPrice;
        var receiveMC = buyMC - exchangeWithdrawFees[middleCoin];
        var sellMC = receiveMC * binanceMiddleCoinPrice;
        var estimatedGains = (sellMC - investment) / (investment);

        if(!minimalOutput){
            console.log(`Start With: $${investment}`);
            console.log("\n\n---------------------");
            console.log(`Start Coin: ${startCoin} \nMiddle Coin: ${middleCoin}`);
            console.log(`Start Coin fees: ${binanceWithdrawFees[startCoin]}${startCoin}`);
            console.log(`Middle Coin Fees: ${exchangeWithdrawFees[middleCoin]}${middleCoin}`);
            console.log("---------------------\n\n ");
            
            console.log(`${startCoin} Buy Price on Binance: ${binanceStartCoinPrice}`);
            console.log(`${startCoin} Sell Price on ${exchange}: ${exchangeStartCoinPrice}`);
            console.log(`${middleCoin} Buy Price on ${exchange}: ${echangeMiddleCoinPrice}`);
            console.log(`${middleCoin} Sell Price on Binance: ${binanceMiddleCoinPrice}`);
            console.log("\n\n---------------------\n\n ");
            console.log(`BUY ${buySC}${startCoin}`);
            console.log(`Transfered to ${exchange} and received ${receiveSC}`);
            console.log(`Sell ${receiveSC} on ${exchange} for $${sellSC}`);
            console.log(`Buy ${buyMC} ${middleCoin}`);
            console.log(`Transfered to Binance and received ${receiveMC}`);
            console.log(`Sell ${middleCoin} on Binance for ${sellMC}`);
            console.log(`Estimated Gains are ${estimatedGains}`);

            return estimatedGains;            
        } else {
            return [estimatedGains, `${exchange}: ${startCoin} -- ${middleCoin} -- Estimated Gains are ${estimatedGains}\n`];
        }
    } catch(ex){

    }
    
    return -1;
}

async function main(){
    await liveCoin.loadData();
    await binance.loadData();
    await exmo.loadData();

    for(var i = 0; i < exchangeList.length; i++){
        highestBuyDiff[exchangeList[i]] = -1;
        leastSellDiff[exchangeList[i]] = 1;
        highestBuyDiffCoin[exchangeList[i]] = "";
        leastSellDiffCoin[exchangeList[i]] = "";
    }

    for(var crypto in cryptoList){
        var coin = cryptoList[crypto];
        compare(coin);
    }


    for(var i = 0; i < exchangeList.length; i++){
        var exchange = exchangeList[i];

        console.log(`\n\nExchange: ${exchange}`);
        console.log(`Highest Buy Diff: ${highestBuyDiffCoin[exchange]} at ${highestBuyDiff[exchange]}`);
        console.log(`Lowest Sell Diff: ${leastSellDiffCoin[exchange]} at ${leastSellDiff[exchange]}`);
    }
    console.log("\n\n");
    
    var highestGains = [-1, ''];

    for(var i = 0; i < cryptoList.length; i++){
        var crypto1 = cryptoList[i];
        for(var j = 0; j < cryptoList.length; j++){
            var crypto2 = cryptoList[j];

            var gains2 = estimateEarnings(crypto1, crypto2, 500, "Exmo", true);

            if(gains2[0] > highestGains[0]){
                highestGains = gains2;
            }
        }
    }

    console.log(`\n\n Highest gains are ${highestGains[1]}\n\n`);
}

main();

//const cryptoList = ["XRP", "WAVES", "DASH", "ZEC", "RDN", "KMD"];  

//const cryptoList = ["XRP", "ZEC", "LTC", "DASH", "WAVES", "LSK", "KMD", "NEO", "EOS"];  
const cryptoList = ["XRP", "ZEC", "LTC", "DASH", "ETC", "WAVES", "LSK", "WINGS", "KMD", "NEO", "EOS", "ICN", "MCO", "MTL"];  
const exchangeList = ["Exmo", "LiveCoin"];

var binanceWithdrawFees = {
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
    "RLC": 5.2
};

var exmoWithdrawFees = {
    "USDT": 28.5,
    "ETH": 0.01,
    "XRP": 0.02,
    "WAVES": 0.001,
    "LTC": 0.01,
    "ZEC": 0.001,
    "DASH": 0.001,
    "ETC": 0.01,
    "XMR": 0.05
};

const liveCoinWithdrawFees = {
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

