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
        var binanceCoin = binance.getCoin(coin);

        var bestBuy = binanceCoin;
        var bestSell = binanceCoin;
        var bestBuyExchange = "Binance";
        var bestSellExchange = "Binance";

        console.log(`Coin: ${coin}`);
        for(var exchange of exchangeList){
            try {
                var exchangeCoin = exchange.getCoin(coin);
                
                if(exchangeCoin.sellPrice > bestSell.sellPrice){
                    bestSell = exchangeCoin;
                    bestSellExchange = exchange.name;
                }

                if(exchangeCoin.buyPrice < bestBuy.buyPrice){
                    bestBuy = exchangeCoin;
                    bestBuyExchange = exchange.name;
                }
            } catch (ex){
                
            }
        }
        console.log(`Best Buy: ${bestBuyExchange}`);
        console.log(`Best Sell: ${bestSellExchange}`);
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