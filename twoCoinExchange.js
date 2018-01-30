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
var fs = require('fs');
var sleep = require('sleep');

const homeCoin = "eth";
const cryptoList = ["XRP", "WAVES", "DASH", "RDN", "KMD", "BCH", "ETC", "LTC", "QTUM", "BCC", "XVG", "zec", "trx", "xvg", "storj", "mco", "lsk", "eos", "bcc"];  

var binance = new Binance();
var exmo = new Exmo();
var liveCoin = new LiveCoin();
var tidex = new Tidex(cryptoList);
var gate = new Gate();
var yobit = new Yobit(cryptoList);
var exx = new Exx();
var bitflip = new Bitflip();
var wex = new Wex(cryptoList);

const exchangeList = [exmo, liveCoin, exx, gate, wex, tidex];

function oneWayCompare(){
    var best = 0;
    var bestLog = "";

    for(var coin of cryptoList){
        var binanceCoin = binance.getCoin(coin, homeCoin);
        console.log(`Coin: ${coin}`);
        for(var exchange of exchangeList){
            try {
                var homeCoinStart = 1;
                var homeCoinWithdraw = 0.01;
                var exchangeCoinWithdraw = exchange.withdrawFees[coin];
                var exchangeCoin = exchange.getCoin(coin, homeCoin);
                
                var pctDiff = (binanceCoin.buyPrice - exchangeCoin.sellPrice) / binanceCoin.buyPrice;
                
                var buyCoin = (homeCoinStart / binanceCoin.buyPrice);
                buyCoin = buyCoin - exchangeCoinWithdraw;
                var sellCoin = (exchangeCoin.sellPrice * buyCoin);
                //sellCoin = sellCoin - homeCoinWithdraw;

                var realPctDiff = (sellCoin - homeCoinStart) / homeCoinStart;
                var output = `Coin: ${coin}  --- Exchange: ${exchange.name} --- Percent Diff: ${realPctDiff} -- Coin Count: ${sellCoin}`;
                
                if(sellCoin > homeCoinStart){
                    bestLog = output;
                    best = realPctDiff;
                }

                console.log(output);
            } catch (ex){
                
            }
        }
        console.log('\n');
    }

    console.log(`Best: ${bestLog}`);  
    
    if(best > 0.015){
        fs.appendFileSync("twoCoin.txt", bestLog);
    }
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

    oneWayCompare();
}

main();