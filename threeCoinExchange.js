const Currency = require('./classes/Currency.js');
const Binance = require('./classes/Binance.js');
const Exmo = require('./classes/Exmo.js');
const LiveCoin = require('./classes/LiveCoin.js');
const Gate = require('./classes/Gate.js');
const Tidex = require('./classes/Tidex.js');
const Yobit = require('./classes/Yobit.js');
const Exx = require('./classes/Exx.js');
const Bitflip = require('./classes/Bitflip.js');
const Wex = require('./classes/Wex.js');
const Liqui = require('./classes/Liqui.js');
var fs = require('fs');
var sleep = require('sleep');

const cryptoList = ["XRP", "WAVES", "DASH", "RDN", "KMD", "BCH", "ETC", "LTC", "QTUM", "BCC", "XVG", "ZEC", "XMR"];  
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
var wex = new Wex(cryptoList);
var liqui = new Liqui(cryptoList);

const exchangeList = [exmo, liveCoin, exx, wex, liqui];

function compare(coin){
    var binanceCurr = 1;

    console.log(coin);

    binanceCurr = binance.getCoin(coin);
    console.log("Binance Price: " + binanceCurr.buyPrice);

    for (var exchange of exchangeList) {
        try {
            var exchangeCoin = exchange.getCoin(coin);

            var bToE = (exchangeCoin.sellPrice - binanceCurr.sellPrice) /binanceCurr.sellPrice;
            var eToB = (exchangeCoin.buyPrice - binanceCurr.buyPrice) / exchangeCoin.buyPrice;
            
            if(bToE > highestBuyDiff[exchange.name]){
                highestBuyDiff[exchange.name] = bToE;
                highestBuyDiffCoin[exchange.name] = coin;
            }

            if(eToB < leastSellDiff[exchange.name]){
                leastSellDiff[exchange.name] = eToB;
                leastSellDiffCoin[exchange.name] = coin;
            }

            console.log(`${exchange.name} Buy Price: ${exchangeCoin.buyPrice} --- ${exchange.name} Sell Price: ${exchangeCoin.sellPrice}`);        
            console.log(`${exchangeCoin.currencyName} -- Binance to ${exchange.name}: ${bToE}`);
            console.log(`${exchangeCoin.currencyName} -- ${exchange.name} to Binance: ${eToB}`);
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

        exchangeStartCoin = exchange.getCoin(startCoin);    
        exchangeMiddleCoin = exchange.getCoin(middleCoin);
        exchangeWithdrawFees = exchange.withdrawFees;

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
            console.log(`${startCoin} Sell Price on ${exchange.name}: ${exchangeStartCoinPrice}`);
            console.log(`${middleCoin} Buy Price on ${exchange.name}: ${echangeMiddleCoinPrice}`);
            console.log(`${middleCoin} Sell Price on Binance: ${binanceMiddleCoinPrice}`);
            console.log("\n\n---------------------\n\n ");
            console.log(`BUY ${buySC}${startCoin}`);
            console.log(`Transfered to ${exchange.name} and received ${receiveSC}`);
            console.log(`Sell ${receiveSC} on ${exchange.name} for $${sellSC}`);
            console.log(`Buy ${buyMC} ${middleCoin}`);
            console.log(`Transfered to Binance and received ${receiveMC}`);
            console.log(`Sell ${middleCoin} on Binance for ${sellMC}`);
            console.log(`Estimated Gains are ${estimatedGains}`);

            return estimatedGains;            
        } else {
            return [estimatedGains, `${exchange.name}: ${startCoin} -- ${middleCoin} -- Estimated Gains are ${estimatedGains}\n`];
        }
    } catch(ex){
        var g = true;
    }
    
    return -1;
}

async function main(){
    var load = [];

    load.push(binance.loadData());

    for(var exch of exchangeList){
        load.push(exch.loadData());
    }

    for(var l of load){
        await l;
    }

    for(var ex of exchangeList){
        highestBuyDiff[ex.name] = -1;
        leastSellDiff[ex.name] = 1;
        highestBuyDiffCoin[ex.name] = "";
        leastSellDiffCoin[ex.name] = "";
    }

    for(var crypto in cryptoList){
        var coin = cryptoList[crypto];
        compare(coin);
    }


    for(var exchange of exchangeList){
        console.log(`\n\nExchange: ${exchange.name}`);
        console.log(`Highest Buy Diff: ${highestBuyDiffCoin[exchange.name]} at ${highestBuyDiff[exchange.name]}`);
        console.log(`Lowest Sell Diff: ${leastSellDiffCoin[exchange.name]} at ${leastSellDiff[exchange.name]}`);
    }
    console.log("\n\n");
    
    var totalHighestGains = [-1, ''];

    for(var ex of exchangeList){
        var highestGains = [-1, ''];

        for(var i = 0; i < cryptoList.length; i++){
            var crypto1 = cryptoList[i];
            for(var j = 0; j < cryptoList.length; j++){
                var crypto2 = cryptoList[j];

                var gains = estimateEarnings(crypto1, crypto2, 500, ex, true);

                if(gains[0] > highestGains[0]){
                    highestGains = gains;
                }

                if(gains[0] > totalHighestGains[0]){
                    totalHighestGains = gains;
                }
            }
        }

        console.log(`Highest gains at ${highestGains[1]}\n\n`);
    }

    console.log(`Total Highest gains at ${totalHighestGains[1]}`);
}

main();


