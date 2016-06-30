var winston = require('winston');
var request = require('request');
var NodeCache = require("node-cache");
var path = require('path');
var fs = require('fs');
var OptionCalculationService = require('../services/OptionCalculationService');
var CalendarDataService = require('../services/CalendarDataService');
var MarketDataService = require('../services/MarketDataService');

var myCache = new NodeCache();

module.exports = function(app) {

    app.get('/api/get/market-data/local/daily/:market/:open/:close/:type/:startYear', function(req, res) {

        var market = req.params.market;
        var DBEOpen = req.params.open;
        var DBEClose = req.params.close;
        var type = req.params.type;
        var startYear = req.params.startYear;

        var marketData = MarketDataService.getMarketData(market)
        var volatilityData = MarketDataService.getMarketData('VIX');

        winston.info("Calculating option dates...");
        var options = CalendarDataService.getOptions(DBEOpen, startYear, type);

        winston.info("Calculating option data...");
        var optionData = OptionCalculationService.getOptionData(marketData, volatilityData, options, DBEClose);
        res.send(optionData);

    });
}
