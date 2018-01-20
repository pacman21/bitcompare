const Currency = require('./classes/Currency.js');
const Binance = require('./classes/Binance.js');
const Exmo = require('./classes/Exmo.js');
const LiveCoin = require('./classes/LiveCoin.js');
const Gate = require('./classes/Gate.js');
const Tidex = require('./classes/Tidex.js');
const Yobit = require('./classes/Yobit.js');
const Exx = require('./classes/Exx.js');
const Bitflip = require('./classes/Bitflip.js');
var fs = require('fs');
var sleep = require('sleep');

const cryptoList = ["XRP", "WAVES", "DASH", "RDN", "KMD", "BCH", "ETC", "LTC", "QTUM", "BCC", "XVG"];  
//const cryptoList = ["XRP", "ZEC", "LTC", "DASH", "WAVES", "LSK", "KMD", "NEO", "EOS"];  
//const cryptoList = ["XRP", "ZEC", "LTC", "DASH", "ETC", "WAVES", "LSK", "WINGS", "KMD", "EOS", "ICN", "MCO", "MTL"];  
//const exchangeList = ["Exmo", "LiveCoin", "Exx", "Yobit", "Bitflip", "Gate"];

var highestBuyDiff = [];
var leastSellDiff = [];
var highestBuyDiffCoin = [];
var leastSellDiffCoin = [];
var binance = new Binance();
var exmo = new Exmo();
var liveCoin = new LiveCoin();
var tidex = new Tidex(cryptoList);
var gate = new Gate();
var yobit = new Yobit(cryptoList);
var exx = new Exx();
var bitflip = new Bitflip();

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
            } else if(exchange == "Tidex") {
                exchangeCoin = tidex.getCoin(coin);
            } else if(exchange == "Gate"){
                exchangeCoin = gate.getCoin(coin);
            } else if(exchange == "Yobit"){
                exchangeCoin = yobit.getCoin(coin);
            } else if(exchange == "Exx"){
                exchangeCoin = exx.getCoin(coin);
            } else if (exchange == "Bitflip"){
                exchangeCoin = bitflip.getCoin(coin);
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
                exchangeWithdrawFees = exmo.withdrawFees;
                break;
            case "LiveCoin":
                exchangeStartCoin = liveCoin.getCoin(startCoin);    
                exchangeMiddleCoin = liveCoin.getCoin(middleCoin);
                exchangeWithdrawFees = liveCoin.withdrawFees;
                break;
            case "Tidex":
                exchangeStartCoin = tidex.getCoin(startCoin);    
                exchangeMiddleCoin = tidex.getCoin(middleCoin);
                exchangeWithdrawFees = tidex.withdrawFees;
                break;
            case "Gate":
                exchangeStartCoin = gate.getCoin(startCoin);    
                exchangeMiddleCoin = gate.getCoin(middleCoin);
                exchangeWithdrawFees = gate.withdrawFees;
                break;
            case "Yobit":
                exchangeStartCoin = yobit.getCoin(startCoin);    
                exchangeMiddleCoin = yobit.getCoin(middleCoin);
                exchangeWithdrawFees = yobit.withdrawFees;
                break;
            case "Exx":
                exchangeStartCoin = exx.getCoin(startCoin);    
                exchangeMiddleCoin = exx.getCoin(middleCoin);
                exchangeWithdrawFees = exx.withdrawFees;
                break;
            case "Bitflip":
                exchangeStartCoin = bitflip.getCoin(startCoin);    
                exchangeMiddleCoin = bitflip.getCoin(middleCoin);
                exchangeWithdrawFees = bitflip.withdrawFees;
                break;
        }

        var exchangeStartCoinPrice = exchangeStartCoin.sellPrice;
        var echangeMiddleCoinPrice = exchangeMiddleCoin.buyPrice;
        
        var buySC = (investment * 0.99) / binanceStartCoinPrice;
        var receiveSC = buySC - binance.withdrawFees[startCoin];
        var sellSC = receiveSC * exchangeStartCoinPrice;
        var buyMC = sellSC / echangeMiddleCoinPrice;
        var receiveMC = buyMC - exchangeWithdrawFees[middleCoin];
        var sellMC = receiveMC * binanceMiddleCoinPrice;
        var estimatedGains = (sellMC - investment) / (investment);

        if(!minimalOutput){
            console.log(`Start With: $${investment}`);
            console.log("\n\n---------------------");
            console.log(`Start Coin: ${startCoin} \nMiddle Coin: ${middleCoin}`);
            console.log(`Start Coin fees: ${binance.withdrawFees[startCoin]}${startCoin}`);
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
        var g = true;
    }
    
    return -1;
}

async function main(){
    var load = [];

    for(var exch of exchangeList){
        switch(exch){
            case "Livecoin":
                load.push(liveCoin.loadData());
                break;
            case "Exmo":
                load.push(exmo.loadData());
                break;
            case "Exx":
                load.push(exx.loadData());
                break;
            case "Yobit":
                load.push(yobit.loadData());
                break;
            case "Bitflip":
                load.push(bitflip.loadData());
                break;
            case "Gate":
                load.push(gate.loadData());
                break;
            case "Kucoin":
                //load.push(liveCoin.loadData());
                break;
            case "Tidex":
                load.push(tidex.loadData());
                break;
        }
    }

    for(var l of load){
        await l;
    }

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

    for(var ex of exchangeList){
        for(var i = 0; i < cryptoList.length; i++){
            var crypto1 = cryptoList[i];
            for(var j = 0; j < cryptoList.length; j++){
                var crypto2 = cryptoList[j];

                var gains = estimateEarnings(crypto1, crypto2, 500, ex, true);

                if(gains[0] > highestGains[0]){
                    highestGains = gains;
                }
            }
        }
    }

    console.log(`\n\n Highest gains are ${highestGains[1]}\n\n`);
}

main();


