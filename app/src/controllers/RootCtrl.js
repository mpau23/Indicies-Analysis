IndiciesAnalysis.controller('RootCtrl', ['$scope', '$http', '$q', 'MarketDataService', 'CalendarDataService',
    function($scope, $http, $q, MarketDataService, CalendarDataService) {

        renderMarketData();

        $scope.marketKeys = ['SPY', 'FTSE', 'GDAXI'];

        $scope.changeDaysToExpiry = function() {

            renderMarketData($scope.daysToExpiry, $scope.marketKey);
        };

        function renderMarketData(daysToExpiry, marketKey) {

            if (!daysToExpiry) {
                daysToExpiry = 15;
            }

            if(!marketKey) {
                marketKey = 'SPY';
            }

            var marketData = MarketDataService.getDailyMarketData(2000, marketKey);
            var monthlyOptions = CalendarDataService.getMonthlyOptions(daysToExpiry, 2000);

            $q.all([marketData]).then(function(response) {

                var marketDataArray = response[0];
                angular.forEach(monthlyOptions, function(monthlyOption, key) {

                    var expiryDate = Date.parse(monthlyOption.expiry.date);
                    var openDate = Date.parse(monthlyOption.open.date);
                    var expiryMarketData = marketDataArray[expiryDate.getTime()];
                    var openMarketData = marketDataArray[openDate.getTime()];

                    if (expiryMarketData) {
                        monthlyOption.expiry.open = expiryMarketData.open;
                        monthlyOption.expiry.close = expiryMarketData.close;
                        monthlyOption.expiry.high = expiryMarketData.high;
                        monthlyOption.expiry.low = expiryMarketData.low;
                    } else {
                        console.log(expiryDate + ": not in market data");
                    }

                    if (openMarketData) {
                        monthlyOption.open.open = openMarketData.open;
                        monthlyOption.open.close = openMarketData.close;
                        monthlyOption.open.high = openMarketData.high;
                        monthlyOption.open.low = openMarketData.low;
                    } else {
                        console.log(openDate + ": not in market data");
                    }

                    if (expiryMarketData && openMarketData) {
                        monthlyOption.variance = (expiryMarketData.close - openMarketData.open) / openMarketData.open;

                        var highestHigh = monthlyOption.open.high;
                        var lowestLow = monthlyOption.open.low;

                        while (expiryDate > openDate) {

                            openDate.addWeekdays(1);

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

                    }

                });

                $scope.marketData = monthlyOptions;

            });
        }

    }
]);
