#BitCompare

A simple script that compares the price from all exchanges in a list to Binance. The withdraw fees aren't exactly correct as they are static and the fees for making trades are guestimated (guestimated at 1% for a full roundtrip). 

##How to run

Run `npm install` on the command line to install the dependencies. 

To execute a three-coin exchange (Coin-1 on Exchange A to Coin-1 on Exchange-B. Sell Coin-1 on Exchange B for Coin-2 (fiat or BTC), buy Coin-3 on Exchange-B and transfer back to Exchange A. Sell Coin-3 for Coin-1) run `node threeCoinExchange.js` in command line

To execute a two-coin exchange (Coin-1 on Exchange A to Coin-1 on Exchange-B. Sell for Coin-2 on Exchange B and transfer to Coin-2 on Exchange A. Sell Coin-2 for Coin-1) run `node twoCoinExchange.js` in command line

##How to customize
You can add coins to the "cryptoList" array. This array is used to determine which coins to compare.
To add additional exchanges, create a new file in the classes folder and make sure to include the required methods that are found in the other exchanges.
The estimate earnings method used in both files assume a 500 dollar investment. You can update this in the script as you wish as the higher the value, more likely the higher the price. 

##A Few Notes
1. I am not responsible for any misuse of this script. This is mainly used for educational purposes only. I use this for fun and to see the differences between the markets. What you use this for is your own business and you assume all risks if you should do anything silly. 
2. The code isn't perfect. I know. Maybe one day I'll make it better.
3. If you want other exchanges added on to this, feel free to make changes as you wish. If you have anything cool to add, do a pull request.

