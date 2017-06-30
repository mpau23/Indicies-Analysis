var winston = require('winston');
var request = require('request');
var NodeCache = require("node-cache");
var path = require('path');
var fs = require('fs');
var OptionCalculationService = require('../services/OptionCalculationService');
var CalendarDataService = require('../services/CalendarDataService');
var MarketDataService = require('../services/MarketDataService');
var Promise = require("bluebird");

var myCache = new NodeCache();

module.exports = function(app) {

    app.get('/api/get/market-data/local/daily/:market/:open/:close/:type/:startYear', function(req, res) {

        var market = req.params.market;
        var DBEOpen = req.params.open;
        var DBEClose = req.params.close;
        var type = req.params.type;
        var startYear = req.params.startYear;

        var marketDataPromise = MarketDataService.getMarketData(market)
        var volatilityDataPromise = MarketDataService.getMarketData('VIX');
        var options = CalendarDataService.getOptions(DBEOpen, startYear, type);

        Promise.all([marketDataPromise, volatilityDataPromise, options]).then(function(response) {

            var marketData = response[0];
            var volatilityData = response[1];
            var optionDates = response[2];

            winston.info("Calculating option data...");
            var optionData = OptionCalculationService.getOptionData(marketData, volatilityData, optionDates, DBEClose);

            winston.info("Sending option data...");
            res.send(optionData);
        });



    });
}
