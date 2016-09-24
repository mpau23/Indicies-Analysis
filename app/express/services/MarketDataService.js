var fs = require('fs');
var path = require('path');
var winston = require('winston');
var NodeCache = require("node-cache");
var myCache = new NodeCache();

var marketDataService = {

    getMarketData: function(market) {

        try {
            winston.info("Attempting to get " + market + " market data from cache");
            cachedResponse = myCache.get("market-data|daily|" + market, true);
            winston.info(market + " Market data retrieved from cache");
            return cachedResponse;

        } catch (err) {

            try {
                winston.info("Market data not in cache. Reading from file...");
                var marketData = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../data/' + market + '.json')));

                winston.info("Data retrieved successfully. Structuring data...");
                var marketDataArray = [];
                marketData.forEach(function(day, index) {
                    var date = Date.parse(day.Date);
                    marketDataArray[date.getTime()] = {
                        date: day.Date,
                        open: day.Open,
                        high: day.High,
                        low: day.Low,
                        close: day.Close
                    };
                });

                var success = myCache.set("market-data|daily|" + market, marketDataArray, 604800);
                if (success) {
                    winston.info(market + " Data saved to cache");
                }

                return marketDataArray;

            } catch (err) {
                winston.info("Unable to get market data for: " + market);
                return null;
            }

        }

    }

}

module.exports = marketDataService;
