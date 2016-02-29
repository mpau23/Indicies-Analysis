var winston = require('winston');
var request = require('request');
var NodeCache = require("node-cache");
var path = require('path');
var fs = require('fs');


var myCache = new NodeCache();

module.exports = function(app) {

    app.get('/api/get/market-data/daily/:market/:startYear', function(req, res) {

        winston.info("Requesting daily data");

        var startDate = req.params.startYear + "-01-01";
        var market = req.params.market;

        try {
            winston.info("Attempting to get " + market + " market data from cache");
            cachedResponse = myCache.get("market-data|daily|" + market + "|" + startDate, true);
            winston.info(market + " Market data retrieved from cache");
            res.send(cachedResponse);

        } catch (err) {

            request('https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_' + market + '.json?auth_token=nsip87vyd8rHj2HTozrx&start_date=' + startDate,
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        if (typeof body !== 'undefined') {
                            winston.info("Data retrieved successfully");
                            var success = myCache.set("market-data|daily|" + market + "|" + startDate, body, 3600);

                            if (success) {
                                winston.info(market + " Data saved to cache");
                            }

                            res.send(body);

                        } else {
                            winston.info(market + " Data corrupted");
                        }

                    } else {
                        winston.info(market + " Unable to get market data: " + error);
                    }
                });
        }



    });

    app.get('/api/get/market-data/local/daily/:market/', function(req, res) {

        var market = req.params.market;

        winston.info("Requesting daily market data from local file: " + market);


        try {
            var marketData = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/../data/' + market + '.json')));
            res.send(marketData);
        } catch (err) {
            winston.info("Unable to get market data for: " + market);
            res.send(err);
        }

    });

}
