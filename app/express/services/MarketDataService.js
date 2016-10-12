var fs = require('fs');
var JSONStream = require('JSONStream');
var path = require('path');
var winston = require('winston');
var NodeCache = require("node-cache");
var myCache = new NodeCache();
var Promise = require("bluebird");

var marketDataService = {

    getMarketData: function(market) {


        return new Promise(function(resolve, reject) {

            try {
                winston.info("Attempting to get " + market + " market data from cache");
                cachedResponse = myCache.get("market-data|daily|" + market, true);
                winston.info(market + " Market data retrieved from cache");
                resolve(cachedResponse);

            } catch (err) {

                try {
                    winston.info("Market data not in cache. Reading from file...");


                    var stream = fs.createReadStream(path.resolve(__dirname + '/../data/' + market + '.json'), { encoding: 'utf8' }),
                        parser = JSONStream.parse();

                    stream.pipe(parser);

                    parser.on('data', function(marketData) {
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

                        resolve(marketDataArray);
                    });

                } catch (err) {
                    winston.info("Unable to get market data for: " + market);
                    reject(err);
                }

            }


        });

    }

}

module.exports = marketDataService;
