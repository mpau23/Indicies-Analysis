IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService',
    function($scope, $http, $q, MarketDataService, CalendarDataService) {

        renderMarketData();

        $scope.marketKeys = ['SPY', 'FTSE', 'GDAXI', 'SLV', 'QQQ', 'IWM'];

        $scope.changeDaysToExpiry = function() {

            renderMarketData($scope.openBeforeExpiry, $scope.marketKey, $scope.closeBeforeExpiry);
        };

        function renderMarketData(daysToExpiry, marketKey, closeBeforeExpiry) {

            if (!daysToExpiry) {
                daysToExpiry = 15;
            }

            if (!closeBeforeExpiry) {
                closeBeforeExpiry = 0;
            }

            if (!marketKey) {
                marketKey = 'SPY';
            }

            var marketData = MarketDataService.getDailyMarketData(2000, marketKey);
            var volatilityData = MarketDataService.getVolatilityData(2000);
            var monthlyOptions = CalendarDataService.getMonthlyOptions(daysToExpiry, 2000);

            $q.all([marketData, volatilityData]).then(function(response) {

                var marketDataArray = response[0];
                var volatilityDataArray = response[1];

                angular.forEach(monthlyOptions, function(monthlyOption, key) {

                    var expiryDate = Date.parse(monthlyOption.expiry.date);
                    expiryDate.addDays(-closeBeforeExpiry);
                    var openDate = Date.parse(monthlyOption.open.date);
                    
                    var expiryMarketData = marketDataArray[expiryDate.getTime()];
                    var openMarketData = marketDataArray[openDate.getTime()];
                    var threshold = 5,
                        expiryThreshold = 0,
                        openThreshold = 0;

                    while (!expiryMarketData && (expiryThreshold <= threshold)) {
                        expiryDate.addDays(1);
                        expiryMarketData = marketDataArray[expiryDate.getTime()];
                        expiryThreshold++;
                    }
                    expiryThreshold = 0;

                    while (!openMarketData && (openThreshold <= threshold)) {
                        openDate.addDays(1);
                        openMarketData = marketDataArray[openDate.getTime()];
                        openThreshold++;
                    }
                    openThreshold = 0;

                    var expiryVolatilityData = volatilityDataArray[expiryDate.getTime()];
                    var openVolatilityData = volatilityDataArray[openDate.getTime()];

                    if (expiryMarketData && openMarketData) {

                        monthlyOption.expiry.date = expiryDate.toString("d-MMM-yyyy");
                        monthlyOption.expiry.open = expiryMarketData.open;
                        monthlyOption.expiry.close = expiryMarketData.close;
                        monthlyOption.expiry.high = expiryMarketData.high;
                        monthlyOption.expiry.low = expiryMarketData.low;

                        var vExpiryDate = new Date(expiryDate.getTime());
                        var vOpenDate = new Date(openDate.getTime());
                        var vExpiryThreshold = 0;
                        var vOpenThreshold = 0;

                        while (!volatilityDataArray[vExpiryDate.getTime()] && (vExpiryThreshold <= threshold)) {
                            vExpiryDate.addDays(-1);
                            vExpiryThreshold++;
                        }

                        while (!volatilityDataArray[vOpenDate.getTime()] && (vOpenThreshold <= threshold)) {
                            vOpenDate.addDays(-1);
                            vOpenThreshold++;
                        }

                        if (vExpiryThreshold == 0) {
                            monthlyOption.expiry.volatility = volatilityDataArray[vExpiryDate.getTime()].open;
                        } else {
                            monthlyOption.expiry.volatility = volatilityDataArray[vExpiryDate.getTime()].close;
                        }

                        if (vOpenThreshold == 0) {
                            monthlyOption.open.volatility = volatilityDataArray[vOpenDate.getTime()].open;

                        } else {
                            monthlyOption.open.volatility = volatilityDataArray[vOpenDate.getTime()].close;
                        }

                        monthlyOption.open.date = openDate.toString("d-MMM-yyyy");
                        monthlyOption.open.open = openMarketData.open;
                        monthlyOption.open.close = openMarketData.close;
                        monthlyOption.open.high = openMarketData.high;
                        monthlyOption.open.low = openMarketData.low;

                        monthlyOption.variance = (expiryMarketData.close - openMarketData.open) / openMarketData.open;

                        var highestHigh = monthlyOption.open.high;
                        var lowestLow = monthlyOption.open.low;

                        while (expiryDate > openDate) {

                            openDate.addDays(1);

                            if (marketDataArray[openDate.getTime()]) {

                                if (marketDataArray[openDate.getTime()].high > highestHigh) {
                                    highestHigh = marketDataArray[openDate.getTime()].high;
                                }
                                if (marketDataArray[openDate.getTime()].low < lowestLow) {
                                    lowestLow = marketDataArray[openDate.getTime()].low;
                                }
                            }

                            monthlyOption.highestHigh = highestHigh;
                            monthlyOption.lowestLow = lowestLow;

                        }

                        if (monthlyOption.variance > 0) {
                            monthlyOption.highLowVariance =
                                ((highestHigh - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
                        } else {
                            monthlyOption.highLowVariance =
                                ((lowestLow - monthlyOption.open.open) / monthlyOption.open.open) - monthlyOption.variance;
                        }

                    } else {
                        console.log("No market data for: Expiry=" + expiryDate + ", Open=" + openDate);
                    }

                });

                $scope.marketData = monthlyOptions;

            });
        }

    }
]);
