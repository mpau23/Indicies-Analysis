var winston = require('winston');
var request = require('request');
var NodeCache = require("node-cache");

var myCache = new NodeCache();

module.exports = function(app) {

    app.get('/api/get/market-data/daily/:startYear', function(req, res) {

        winston.info("Requesting daily data");

        var startDate = req.params.startYear + "-01-01";

        try {
            winston.info("Attempting to get market data from cache");
            cachedResponse = myCache.get("market-data|daily|" + startDate, true);
            winston.info("Market data retrieved from cache");
            res.send(cachedResponse);

        } catch (err) {

            request('https://www.quandl.com/api/v3/datasets/YAHOO/INDEX_SPY.json?auth_token=nsip87vyd8rHj2HTozrx&start_date=' + startDate,
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {

                        if (typeof body !== 'undefined') {
                            winston.info("Data retrieved successfully");
                            var success = myCache.set("market-data|daily|" + startDate, body, 3600);

                            if (success) {
                                winston.info("Data saved to cache");
                            }

                            res.send(body);

                        } else {
                            winston.info("Data corrupted");
                        }

                    } else {
                        winston.info("Unable to get market data: " + error);
                    }
                });
        }



    });

}
