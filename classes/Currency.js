module.exports = class Currency {
    constructor( currencyName, buyPrice,  sellPrice){
        this.currencyName = currencyName;
        this.buyPrice = buyPrice;
        this.sellPrice = sellPrice;
    }
}